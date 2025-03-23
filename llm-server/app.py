# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from datetime import datetime,timedelta
# from dateutil import parser
# import requests
# import json

# app = Flask(__name__)
# CORS(app)

# OLLAMA_API = "http://localhost:11434/api/generate"
# MODEL = "mistral"

# user_context = {
#     "cycle_opted_in": False,
#     "last_period_date": None
# }

# def query_ollama(prompt):
#     payload = {
#         "model": MODEL,
#         "prompt": prompt,
#         "stream": False
#     }
#     response = requests.post(OLLAMA_API, json=payload)
#     return response.json().get("response", "Sorry, something went wrong.")

# def construct_phase_and_activities(days_since_last_period):
#     print(f"Days since last period: {days_since_last_period}")  # Debugging line

#     if days_since_last_period <= 5:
#         phase = "Menstrual Phase"
#     elif 6 <= days_since_last_period <= 14:
#         phase = "Follicular Phase"
#     elif 15 <= days_since_last_period <= 17:
#         phase = "Ovulatory Phase"
#     elif 18 <= days_since_last_period <= 28:
#         phase = "Luteal Phase"
#     else:
#         print("Phase determination failed.")  # Debugging line
#         return None, None

#     prompt = (
#         f"You are Eva, a planner assistant.\n"
#         f"Cycle phase: {phase}.\n"
#         f"For each of the 4 categories: Self-Care, Physical Health, Mental Wellness, and Productivity & Growth,\n"
#         f"replace activities with new ones that are best suited for this phase and activities should be of 4 words maximum.\n"
#         f"Keep activities realistic, gentle, and 1-hour long.\n"
#         f"Return a JSON object with the following format:\n"
#         f"{{\n"
#         f"  \"Self-Care\": [\n"
#         f"    {{\"activity\": \"<new activity>\", \"duration\": \"1 hour\"}},\n"
#         f"  ],\n"
#         f"  \"Physical Health\": [\n"
#         f"    {{\"activity\": \"<new activity>\", \"duration\": \"1 hour\"}},\n"
#         f"  ],\n"
#         f"  \"Mental Wellness\": [\n"
#         f"    {{\"activity\": \"<new activity>\", \"duration\": \"1 hour\"}},\n"
#         f"  ],\n"
#         f"  \"Productivity & Growth\": [\n"
#         f"    {{\"activity\": \"<new activity>\", \"duration\": \"1 hour\"}},\n"
#         f"  ]\n"
#         f"}}\n"
#         f"Ensure that this is valid JSON without any extra characters or incomplete strings. Provide specific activities based on the phase you are in with only 4 words."
#     )

#     return phase, prompt

# def send_data_to_api(data):
#     # Hardcode the email
#     email = "jane.doe@shedule.com"
    
#     # Build the target URL with the hardcoded email
#     target_url = f"http://localhost:5002/get-all-activities/{email}"
    
#     headers = {
#         'Content-Type': 'application/json',
#     }
    
#     # Send the POST request to the target API with the data
#     response = requests.post(target_url, json=data, headers=headers)
    
#     # Check the response from the API
#     if response.status_code == 200:
#         print("Data successfully sent to target API!")
#         print("Response from API:", response.json())  # Log the response from the target API
#     else:
#         print(f"Failed to send data. Status code: {response.status_code}, Response: {response.text}")

# @app.route('/chat', methods=['POST'])
# def chat():
#     data = request.json
#     intent = data.get("intent", "")
#     last_period_date = data.get("lastPeriodDate", "")

#     if intent == "greet":
#         return jsonify({
#             "reply": "Hi Jane! I'm Eva. Would you like us to tailor your suggestions based on your cycle?"
#         })
    
#     if intent == "cycle_opt_in_yes":
#         user_context["cycle_opted_in"] = True
#         return jsonify({"reply": "When did your last period start?"})

#     if intent == "submit_period_date" and last_period_date:
#         try:
#             last_date = parser.parse(last_period_date).date()
#             days_ago = (datetime.today().date() - last_date).days
#             print(f"Last period date: {last_date}, Days ago: {days_ago}")  # Debugging line
#             user_context["last_period_date"] = last_date

#             next_period_date = last_date + timedelta(days=28)
#             print(f"Next period date: {next_period_date}") 

#             # Ensure correct phase determination
#             phase, prompt = construct_phase_and_activities(days_ago)
#             print(f"Phase: {phase}")  # Debugging line to verify phase determination

#             if phase:
#                 llm_response = query_ollama(prompt)

#                 # Parse the LLM response if it's a string
#                 try:
#                     llm_response = json.loads(llm_response)  # Ensure it's a dictionary
#                 except json.JSONDecodeError:
#                     return jsonify({"reply": "Error processing the LLM response. Please try again."})

#                 # Add email and next period date to the LLM response
#                 llm_response["email"] = "jane.doe@gmail.com"
#                 llm_response["nextPeriodDate"] = next_period_date.strftime("%Y-%m-%d")
#                 print("LLM Response with email and next period date:", llm_response)  

#                 # Send the LLM response to another API
#                 send_data_to_api(llm_response)

#                 return jsonify({
#                     "reply": f"You are currently in your {phase}. Here’s something tailored for you 🌼",
#                     "suggestedActivities": llm_response,
#                     "email": "jane.doe@gmail.com",  # Add the email in the response too
#                     "nextPeriodDate": next_period_date.strftime("%Y-%m-%d")
#                 })
#             else:
#                 return jsonify({
#                     "reply": "We couldn’t determine the cycle phase. Please re-enter the date or explore options.",
#                     "options": ["Enter date again", "More options"]
#                 })

#         except Exception as e:
#             print("Date parsing error:", e)
#             return jsonify({"reply": "Sorry, I couldn't understand that. Please enter the date in YYYY-MM-DD format."})

#     return jsonify({"reply": "I'm not sure I understood that. Let's start again!"})

# if __name__ == "__main__":
#     app.run(port=5001)


from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
from dateutil import parser
import requests
import json
import re

app = Flask(__name__)
CORS(app)

OLLAMA_API = "http://localhost:11434/api/generate"
MODEL = "mistral"

# Specific email for fetching activities
EMAIL = "ananya@example.com"
DATE = "2025-03-21"

# Restricted activities for each phase
RESTRICTED_ACTIVITIES = {
    "Follicular Phase": ["sauna"],
    "Menstrual Phase": ["soulcycle", "Workout"],  # Added "Workout"
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
    # Generate a prompt for Ollama to suggest a replacement activity
    prompt = (
        f"You are Eva, a planner assistant. The user is in their {phase} phase. "
        f"The activity '{unsuitable_activity}' is not recommended for this phase. "
        f"Suggest a gentle, realistic alternative activity of two words maximum. "
        f"Return the replacement activity in the following JSON format:\n"
        f"{{\n"
        f"  \"replacement_activity\": \"<replacement activity>\"\n"
        f"}}\n"
    )

    # Query Ollama for the replacement activity
    llm_response = query_ollama(prompt)

    try:
        # Clean and parse the Ollama response
        cleaned_response = clean_json_response(llm_response)
        if not cleaned_response:
            raise ValueError("No valid JSON found in Ollama response.")

        response_data = json.loads(cleaned_response)
        replacement_activity = response_data.get("replacement_activity", "")
        return replacement_activity
    except (json.JSONDecodeError, ValueError) as e:
        print(f"Failed to parse Ollama response: {e}. Using default replacement activity.")
        return "Gentle Stretching"  # Default fallback activity

def replace_most_unsuitable_activity(activities, phase):
    # Get the restricted activities for the current phase
    restricted_activities = RESTRICTED_ACTIVITIES.get(phase, [])
    print(f"Phase: {phase}")  # Debugging line
    print(f"Restricted activities for this phase: {restricted_activities}")  # Debugging line

    # Find the first restricted activity in the array
    for i, activity in enumerate(activities):
        if activity in restricted_activities:
            # Get a replacement activity from Ollama
            replacement_activity = get_replacement_activity(phase, activity)
            print(f"Replacing '{activity}' with '{replacement_activity}'")  # Debugging line
            # Replace the activity
            activities[i] = replacement_activity
            break  # Only replace one activity
    else:
        print("No restricted activities found in the list.")  # Debugging line

    return activities

def send_activities_to_api(email, date, activities):
    # Define the API endpoint
    api_url = "http://localhost:5002/api/replace-user-activity"

    # Prepare the data payload
    data = {
        "email": email,
        "date": date,
        "activities": activities
    }

    # Send the PUT request
    headers = {"Content-Type": "application/json"}
    response = requests.put(api_url, json=data, headers=headers)

    # Check the response
    if response.status_code == 200:
        print("Activities successfully sent to the API!")
        print("Response from API:", response.json())  # Log the response from the API
    else:
        print(f"Failed to send activities. Status code: {response.status_code}, Response: {response.text}")

def construct_phase(days_since_last_period):
    print(f"Days since last period: {days_since_last_period}")  # Debugging line

    if days_since_last_period <= 5:
        phase = "Menstrual Phase"
    elif 6 <= days_since_last_period <= 14:
        phase = "Follicular Phase"
    elif 15 <= days_since_last_period <= 17:
        phase = "Ovulatory Phase"
    elif 18 <= days_since_last_period <= 28:
        phase = "Luteal Phase"
    else:
        print("Phase determination failed.")  # Debugging line
        return None

    return phase

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    intent = data.get("intent", "")
    last_period_date = data.get("lastPeriodDate", "")

    if intent == "greet":
        return jsonify({
            "reply": "Hi Jane! I'm Eva. Would you like us to tailor your suggestions based on your cycle?"
        })

    if intent == "cycle_opt_in_yes":
        user_context["cycle_opted_in"] = True
        return jsonify({"reply": "When did your last period start?"})

    if intent == "submit_period_date" and last_period_date:
        try:
            last_date = parser.parse(last_period_date).date()
            days_ago = (datetime.today().date() - last_date).days
            print(f"Last period date: {last_date}, Days ago: {days_ago}")  # Debugging line
            user_context["last_period_date"] = last_date

            next_period_date = last_date + timedelta(days=28)
            print(f"Next period date: {next_period_date}")

            # Determine the phase
            phase = construct_phase(days_ago)
            print(f"Phase: {phase}")  # Debugging line to verify phase determination

            if phase:
                # Fetch activities from the API using the specific email and current date
                activities_data = fetch_activities(EMAIL, DATE)
                if activities_data:
                    # Replace the most unsuitable activity
                    modified_activities = replace_most_unsuitable_activity(activities_data["activities"], phase)
                    activities_data["activities"] = modified_activities

                    # Send the modified activities to the API
                    send_activities_to_api(EMAIL, DATE, modified_activities)

                    # Return the modified activities
                    return jsonify({
                        "email": EMAIL,
                        "date": DATE,
                        "activities": modified_activities
                    })
                else:
                    return jsonify({"reply": "Failed to fetch activities."})

        except Exception as e:
            print("Date parsing error:", e)
            return jsonify({"reply": "Sorry, I couldn't understand that. Please enter the date in YYYY-MM-DD format."})

    return jsonify({"reply": "I'm not sure I understood that. Let's start again!"})

if __name__ == "__main__":
    app.run(port=5001)