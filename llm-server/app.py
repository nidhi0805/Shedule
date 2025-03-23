from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import requests
import json
import re

app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "*"}})

OLLAMA_API = "http://localhost:11434/api/generate"
MODEL = "mistral"

# Restricted activities for each phase
RESTRICTED_ACTIVITIES = {
    "Follicular Phase": ["Sauna"],
    "Menstrual Phase": ["SoulCycle", "Workout"],  # Added "Workout"
    "Ovulatory Phase": ["HIIT"],
    "Luteal Phase": ["Explore Cafes"]
}

user_context = {
    "cycle_opted_in": False,
    "last_period_date": None
}

def query_ollama(prompt):
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(OLLAMA_API, json=payload)
    return response.json().get("response", "Sorry, something went wrong.")

def clean_json_response(response):
    # Extract JSON from the response using regex
    json_match = re.search(r"\{.*\}", response, re.DOTALL)
    if json_match:
        return json_match.group(0)
    return None

def fetch_activities(email, date):
    url = f"http://localhost:5002/api/get-user-activity/{email}/{date}"
    print(f"Fetching activities from: {url}")  # Debugging line
    response = requests.get(url)
    print(f"Response status code: {response.status_code}")  # Debugging line
    if response.status_code == 200:
        response_json = response.json()
        print(f"Response JSON: {json.dumps(response_json, indent=2)}")
        return response_json
    else:
        print(f"Failed to fetch activities. Status code: {response.status_code}, Response: {response.text}")  # Debugging line
        return None

def get_replacement_activity(phase, unsuitable_activity):
    prompt = (
        f"You are Eva, a planner assistant. The user is in their {phase} phase. "
        f"The activity '{unsuitable_activity}' is not recommended for this phase. "
        f"Suggest a gentle, realistic alternative activity of two words maximum. "
        f"Return the replacement activity in the following JSON format:\n"
        f"{{\n"
        f"  \"replacement_activity\": \"<replacement activity>\"\n"
        f"}}\n"
    )

    llm_response = query_ollama(prompt)

    try:
        cleaned_response = clean_json_response(llm_response)
        if not cleaned_response:
            raise ValueError("No valid JSON found in Ollama response.")

        response_data = json.loads(cleaned_response)
        replacement_activity = response_data.get("replacement_activity", "")
        return replacement_activity
    except (json.JSONDecodeError, ValueError) as e:
        print(f"Failed to parse Ollama response: {e}. Using default replacement activity.")
        return "Gentle Stretching"

def replace_most_unsuitable_activity(activities, phase):
    restricted_activities = RESTRICTED_ACTIVITIES.get(phase, [])
    print(f"Phase: {phase}")  # Debugging line
    print(f"Restricted activities for this phase: {restricted_activities}")  # Debugging line

    for i, activity in enumerate(activities):
        if activity in restricted_activities:
            replacement_activity = get_replacement_activity(phase, activity)
            print(f"Replacing '{activity}' with '{replacement_activity}'")  # Debugging line
            activities[i] = replacement_activity
            break
    else:
        print("No restricted activities found in the list.")  # Debugging line

    return activities

def send_activities_to_api(email, date, activities, period_date):
    api_url = f"http://localhost:5002/api/replace-user-activity/"
    data = {
        "email": email,
        "date": date,
        "activities": activities,
        "period_date": period_date
    }
    print(f"Sending activities to API: {api_url}")  # D

    headers = {"Content-Type": "application/json"}
    response = requests.put(api_url, json=data, headers=headers)

    if response.status_code == 200:
        print("Activities successfully sent to the API!")
        print("Response from API:", response.json())
    else:
        print(f"Failed to send activities. Status code: {response.status_code}, Response: {response.text}")

def construct_phase(days_since_last_period):
    print(f"Days since last period: {days_since_last_period}")  # Debugging line

    if days_since_last_period <= 5:
        return "Menstrual Phase", "Day 1 to Day 5: The menstrual phase begins with the first day of your period and lasts until the bleeding ends. This phase is often associated with fatigue and lower energy levels."
    elif 6 <= days_since_last_period <= 14:
        return "Follicular Phase", "Day 6 to Day 14: The follicular phase begins after your period ends and lasts until ovulation. It's characterized by increased energy and improved mood."
    elif 15 <= days_since_last_period <= 17:
        return "Ovulatory Phase", "Day 15 to Day 17: The ovulatory phase is when you ovulate. It's the most fertile phase, and energy levels tend to peak."
    elif 18 <= days_since_last_period <= 28:
        return "Luteal Phase", "Day 18 to Day 28: The luteal phase follows ovulation and lasts until your next period starts. It's associated with changes in mood and energy as your body prepares for menstruation."
    else:
        return None, "Phase determination failed."

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        intent = data.get("intent", "")
        last_period_date = data.get("lastPeriodDate", None)
        user_email = data.get("email", None)  # Get email from the request
        print(f"User email: {user_email}")  # Debugging line
        current_date = data.get("currentDate", None) 

        if intent == "greet":
            return jsonify({
                "reply": "Hi Jane! I'm Eva. Would you like us to tailor your suggestions based on your cycle?"
            })

        if intent == "cycle_opt_in_yes":
            user_context["cycle_opted_in"] = True
            return jsonify({"reply": "When did your last period start?"})

        # Ensure last_period_date is provided
        if intent == "submit_period_date":
            if not last_period_date:
                return jsonify({"reply": "Please provide your last period date in YYYY-MM-DD format."})
            if not user_email or not current_date:
                return jsonify({"reply": "Email or current date is missing."})

            try:
                # Ensure last_period_date is in the correct format
                last_period_date = datetime.strptime(last_period_date, "%Y-%m-%d")
                next_period_date = last_period_date + timedelta(days=28)
                period_date = next_period_date.strftime("%Y-%m-%d")
                print(f"Next period date: {period_date}")

                activities_data = fetch_activities(user_email, current_date)
                if activities_data:
                    # Calculate phase based on last period date
                    days_since_last_period = (datetime.today().date() - last_period_date.date()).days
                    phase, phase_description = construct_phase(days_since_last_period)
                    print(f"Phase: {phase}")
                    if phase:
                        modified_activities = replace_most_unsuitable_activity(activities_data["activities"], phase)
                        activities_data["activities"] = modified_activities
                        print(f"Modified activities: {activities_data['activities']}")
                        send_activities_to_api(user_email, current_date, activities_data["activities"], period_date)
                        return jsonify({
                            "reply": f"Customizing your calendar based on your {phase}...{phase_description}",
                            "email": user_email,
                            "date": current_date,
                            "activities": activities_data["activities"],
                            "period_date": period_date,
                        })
                return jsonify({"reply": "Failed to fetch activities."})

            except ValueError as e:
                # Handle any errors that may arise due to incorrect date format
                print(f"Date parsing error: {e}")
                return jsonify({"reply": "Sorry, I couldn't understand that. Please enter the date in YYYY-MM-DD format."})

        return jsonify({"reply": "I'm not sure I understood that. Let's start again!"})

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"reply": "Sorry, something went wrong. Please try again."})

if __name__ == "__main__":
    app.run(port=5001)
