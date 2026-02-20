import requests
import datetime

urls = {"OpenAI API": "https://status.openai.com/api/v2/components.json"}
def getFormattedDT(dt):
    dt = datetime.datetime.strptime(dt, "%Y-%m-%dT%H:%M:%SZ")
    formatted = dt.strftime("%Y-%m-%d %H:%M:%S")
    return formatted

for api, url in urls.items():
    response = requests.get(url)
    data = response.json()
    for component in data.get("components", []):
        formatted_dt = getFormattedDT(component["updated_at"])
        print(f"[{formatted_dt}] Product: {api} - {component['name']}")
        print(f"Status: {component['status']}")
        print()
