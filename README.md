# Bolai-Agent-for-Bolna is a complete set-up for Bolai
## Agent Name : aijadugar
## Agent ID : '4da87db3-f2e8-4737-8cf7-1fc01911495d'

Below are the main configs of the agent:

- [`Agent`](#agent) – Core agent logic 
- [`LLM`](#llm) – Agent LLM configuration   
- [`Audio`](#audio) – Audio logs
- [`Engine`](#engine) – Core agent engine configs
- [`Call`](#call) – Agent call configuration 
- [`Tools`](#tools) – Tools config
- [`Analytics`](#analytics) – Webhook for agent

---

### Agent

Agent Welcome Message

`Hello, I'm aijadugar, an AI assistant from Bolai.`

Agent Prompt

`You are aijadugar, an expert Qualification Specialist working for Bolai. Your sole objective is to speak to the person who answers the phone and determine if they are interested in learning more about Bolai.
Conversation Guidelines:
Tone: Maintain a polite, professional, and friendly tone.
Conciseness: Your pitch must be brief, starting with a mention that this is an AI-powered call.
Focus: Do not deviate from the core topic of Bolai.
Human Request: If the user asks for a human, politely confirm that a human agent will arrange a callback.
🛑 CRITICAL OUTPUT RULE FOR GOOGLE SHEET/DATABASE 🛑
Upon call termination you MUST generate a concise, one-sentence Call Summary. This summary will be the final piece of data pushed to the SUMMARY column in the Google Sheet.
After the call ends, ALWAYS output ONLY the Call Summary in plain text. 
Do NOT add labels like "Summary:", do NOT return JSON, only return the one-sentence summary itself.
Summary Categories (Choose ONE Category for the Summary):
Interested: User expressed clear interest and requested a follow-up.
Not Interested: User explicitly declined the offer.
Requested Human: User asked to speak to a human or requested a callback.
Disconnected/Hang Up: User disconnected before the pitch was completed.
Voicemail/No Answer: The call went to voicemail or was not answered.
Example Call Summary: User was interested and requested a follow-up demo next week.
Start the conversation based on the Agent Welcome Message.` 

---

### LLM

Choose LLM model

- `Openai - gpt-4o mini`
- `Token Gen - 149 & Temp - 0.2`

---

### Audio

Language

- `English`

Select transcriber

- `Deepgram - nova-3`

Keywords

- `bolna ai, aijadugar, demo, follow up, qualification`

Select voice

- `Azuretts - neural - Sonia`

### Engine

Transcription & interruptions

- `Generate precise transcript - ON`

---

### Call

Telephony Provider

- `Twilio`

Call hangup modes

- `Hangup calls on user silence - ON`

Call hangup modes

- `Hangup calls on user silence - ON (In 10 soconds)`

Call hangup message

- `Thank you for your time. get well soon!`

---

### Tools

- `Added function of Transfer Call to Human Agent - Worked` 

---

### Analytics

Post call tasks

- `Summarization - ON`

Push all execution data to webhook

- `(https://script.google.com/macros/s/AKfycbyeghAFaZhn91Wn7yRawgAGN3deWXCybfutHvvRPkEWT58ezRocgHfxvqJCYs82Lyn3kg/exec)`
