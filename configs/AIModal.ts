import { OpenAI } from 'openai';

const apiClient = new OpenAI({
    baseURL: 'https://api.chatanywhere.tech', //baseURL` 是 OpenAI API 的基础 URL，指向 API 请求的地址。
    dangerouslyAllowBrowser: true, // 允许浏览器使用
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

//表单生成格式
const PROMPT = 'on the basis of description create a JSON object, including \'formTitle\', \'formHeading\', and an array of form fields with \'fieldName\', \'fieldTitle\', \'fieldType\', \'placeholder\', \'label\', \'required\', and for \'select\' or \'radio\'or \'checkbox\' types, include \'options\' with \'value\' and \'text\' properties:'

export async function AiChatSession(userInput: string) {
    const completion = await apiClient.beta.chat.completions.parse({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: "user", content: "Discription:" + userInput + PROMPT }
        ],
    });

    return completion;
}