from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime,timedelta
from dateutil import parser
import requests
import json

app = Flask(__name__)
CORS(app)

OLLAMA_API = "http://localhost:11434/api/generate"
MODEL = "mistral"

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

def construct_phase_and_activities(days_since_last_period):
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
        return None, None

    prompt = (
        f"You are Eva, a planner assistant.\n"
        f"Cycle phase: {phase}.\n"
        f"For each of the 4 categories: Self-Care, Physical Health, Mental Wellness, and Productivity & Growth,\n"
        f"replace activities with new ones that are best suited for this phase and activities should be of 4 words maximum.\n"
        f"Keep activities realistic, gentle, and 1-hour long.\n"
        f"Return a JSON object with the following format:\n"
        f"{{\n"
        f"  \"Self-Care\": [\n"
        f"    {{\"activity\": \"<new activity>\", \"duration\": \"1 hour\"}},\n"
        f"  ],\n"
        f"  \"Physical Health\": [\n"
        f"    {{\"activity\": \"<new activity>\", \"duration\": \"1 hour\"}},\n"
        f"  ],\n"
        f"  \"Mental Wellness\": [\n"
        f"    {{\"activity\": \"<new activity>\", \"duration\": \"1 hour\"}},\n"
        f"  ],\n"
        f"  \"Productivity & Growth\": [\n"
        f"    {{\"activity\": \"<new activity>\", \"duration\": \"1 hour\"}},\n"
        f"  ]\n"
        f"}}\n"
        f"Ensure that this is valid JSON without any extra characters or incomplete strings. Provide specific activities based on the phase you are in with only 4 words."
    )

    return phase, prompt

def send_data_to_api(data):
    # Hardcode the email
    email = "jane.doe@shedule.com"
    
    # Build the target URL with the hardcoded email
    target_url = f"http://localhost:5002/get-all-activities/{email}"
    
    headers = {
        'Content-Type': 'application/json',
    }
    
    # Send the POST request to the target API with the data
    response = requests.post(target_url, json=data, headers=headers)
    
    # Check the response from the API
    if response.status_code == 200:
        print("Data successfully sent to target API!")
        print("Response from API:", response.json())  # Log the response from the target API
    else:
        print(f"Failed to send data. Status code: {response.status_code}, Response: {response.text}")

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

            # Ensure correct phase determination
            phase, prompt = construct_phase_and_activities(days_ago)
            print(f"Phase: {phase}")  # Debugging line to verify phase determination

            if phase:
                llm_response = query_ollama(prompt)

                # Parse the LLM response if it's a string
                try:
                    llm_response = json.loads(llm_response)  # Ensure it's a dictionary
                except json.JSONDecodeError:
                    return jsonify({"reply": "Error processing the LLM response. Please try again."})

                # Add email and next period date to the LLM response
                llm_response["email"] = "jane.doe@gmail.com"
                llm_response["nextPeriodDate"] = next_period_date.strftime("%Y-%m-%d")
                print("LLM Response with email and next period date:", llm_response)  

                # Send the LLM response to another API
                send_data_to_api(llm_response)

                return jsonify({
                    "reply": f"You are currently in your {phase}. Here’s something tailored for you 🌼",
                    "suggestedActivities": llm_response,
                    "email": "jane.doe@gmail.com",  # Add the email in the response too
                    "nextPeriodDate": next_period_date.strftime("%Y-%m-%d")
                })
            else:
                return jsonify({
                    "reply": "We couldn’t determine the cycle phase. Please re-enter the date or explore options.",
                    "options": ["Enter date again", "More options"]
                })

        except Exception as e:
            print("Date parsing error:", e)
            return jsonify({"reply": "Sorry, I couldn't understand that. Please enter the date in YYYY-MM-DD format."})

    return jsonify({"reply": "I'm not sure I understood that. Let's start again!"})

if __name__ == "__main__":
    app.run(port=5001)