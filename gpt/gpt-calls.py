import openai
import config

def categorize_single(input): 
    try:
        import openai
        import config

        openai.api_key = config.api_key
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that categorizes an expense " \
                                                "into the following categories: food, clothing, housing, transportation,  " \
                                                "entertainment, healthcare, personal. Only respond with the name of the category that best fits the expense description"},
                {"role": "user", "content": input}
            ],
            temperature=0,
            max_tokens=256
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        print(f"An error occurred: {e}")
    
def categorize_multiple(input): 
    try:
        import openai
        import config

        openai.api_key = config.api_key
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that categorizes a list of expenses " \
                                                "into the following categories: food, clothing, housing, transportation,  " \
                                                "entertainment, healthcare, personal. Respond only with a python formatted list where each element is the corresponding category for the element in the expense list"},
                {"role": "user", "content": "[" + ", ".join(input) + "]"}
            ],
            temperature=0,
            max_tokens=256
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        print(f"An error occurred: {e}")