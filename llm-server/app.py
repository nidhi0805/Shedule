from flask import Flask, request, jsonify,render_template
import requests
from datetime import datetime

app = Flask(__name__)
OLLAMA_API = "http://localhost:11434/api/generate"
MODEL = "mistral"

# Global session memory (can be improved using Flask session or DB)
user_context = {
    "cycle_opted_in": False,
    "last_period_date": None,
    "pregnancy_mode": False,
    "pregnancy_start_date": None
}

def query_ollama(prompt):
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(OLLAMA_API, json=payload)
    return response.json().get("response", "Sorry, something went wrong.")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get("message", "")
    name = data.get("name", "there")

    # Step 1: Menstrual cycle opt-in
    if "yes" in user_input.lower() and "cycle" in user_input.lower():
        user_context["cycle_opted_in"] = True
        return jsonify({"reply": "Great! Please tell me the date your last period started. (e.g., March 1)"})

    # Step 2: Get last period date
    if user_context["cycle_opted_in"] and user_context["last_period_date"] is None:
        try:
            last_date = datetime.strptime(user_input, "%B %d")  # e.g., March 1
            today = datetime.today()
            last_date = last_date.replace(year=today.year)
            user_context["last_period_date"] = last_date
            delta_days = (today - last_date).days

            if delta_days > 28:
                user_context["pregnancy_mode"] = True
                return jsonify({"reply": "It's been more than 28 days. Would you like pregnancy support enabled? If yes, please tell me when your pregnancy began."})
            else:
                return jsonify({"reply": "Thanks! Your cycle will now be considered for personalized suggestions."})
        except:
            return jsonify({"reply": "Sorry, I couldn't understand the date. Please say it like 'March 1'."})

    # Step 3: Pregnancy support
    if user_context["pregnancy_mode"] and user_context["pregnancy_start_date"] is None:
        try:
            start_date = datetime.strptime(user_input, "%B %d")
            start_date = start_date.replace(year=datetime.today().year)
            user_context["pregnancy_start_date"] = start_date
            return jsonify({"reply": "Got it! I'll now tailor your schedule for pregnancy wellness and energy levels."})
        except:
            return jsonify({"reply": "Sorry, please give the pregnancy start date like 'February 10'."})

    # Default chat response using Ollama
    system_prompt = f"""
You are Eva, a warm, Alexa-like voice assistant for Shedule. You greet the user by name, ask about their day, and provide balanced task planning based on their health and energy.
Support users through pregnancy and menstrual cycle if context is provided.
"""

    full_prompt = f"{system_prompt}\nUser ({name}): {user_input}\nEva:"
    response = query_ollama(full_prompt)
    return jsonify({"reply": response})

@app.route('/')
def index():
    return render_template("chat.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
