# gpt-next (Language Learning Assistant POC)

### OpenAI
<img src="https://github.com/jrhe123/gpt-next/assets/17329299/a95955d3-81b5-42d5-9d70-64d21f81bcbc"  width="150"><br />

* Token: 4k limit for context learning
  * 0.5 chinese word (average)
  * 0.75 english word
  * GPT4 (8k / 32k)
  * warning: will lose the starting context if exceed the token limit
  * https://platform.openai.com/tokenizer
  
<img src="https://github.com/jrhe123/gpt-next/assets/17329299/0b863b79-e2dc-46b3-a698-0fe7d7e5f766" width="300"><br />



<br /><br />
* Model
  * Natural language (NLP)
    * GPT4
    * GPT3.5
  * Language recognition
    * Whisper
  * Image generation
    * DALL-E
  * Text to digital
    * Embeddings
  * Code generation
    * CodeX
```
| /v1/chat/completions      | gpt-4, gpt-4-0314, gpt-4-32k, gpt-4-32k-0314, gpt-3.5-turbo, gpt-3.5-turbo-0301
| /v1/completions           | text-davinci-003, text-davinci-002, text-curie-001, text-babbage-001, text-ada-001, davinci, curie, babbage, ada
| /v1/edits                 | text-davinci-edit-001, code-davinci-edit-001
| /v1/audio/transcriptions  | whisper-1
| /v1/audio/translations    | whisper-1
| /v1/fine-tunes            | davinci, curie, babbage, ada
| /v1/embeddings            | text-embedding-ada-002, text-search-ada-doc-001
| /v1/moderations           | text-moderation-stable, text-moderation-latest
```



<br /><br />
* API Examples:
```
Completions:
{
 "model": "text-davinci-003",
 "prompt": "Say this is a test",
 "max_tokens": 7, // return content token limit
 "temperature": 0, // higher -> increase the random [Range 0-2]
 "stream": false // server event
}
```

```
Chat:
{
 "model": "gpt-3.5-turbo",
 "messages": [
  {
   "role": "system",
   "content": "You are a helpful assistant."
  },
  {
   "role": "user",
   "content": "Who won the NBA title in 2023?"
  },
  {
   "role": "assistant",
   "content": "The Los Angeles Lakers won the World Champion in 2023."
  },
  {
   "role": "user",
   "content": "Where was it played?"
  }
 ], // previous conversation records
 "max_tokens": 7, // return content token limit
 "temperature": 0, // higher -> increase the random [Range 0-2]
 "stream": false // server event
}
```



<br /><br />
* Prompts:
  * RIO (Role + Input + Output)
    * Role: Assistant / Teacher / Mentor
    * Input
      * Context
      * Task
    * Output
      * Format
      * Style
      * Quantity
      * Way of Thinking



<br /><br />
* Common Prompts:
  * Zero-shot:
    * e.g., how to use javascript slice 
  * Few-shot:
    * e.g., provide DSL model (storybook), and build a new webpage 
  * Fine-tune:
    * e.g., mix with 10-100GB data, weighted the original model 
  * Chain of thought:
    * e.g., solve the problem, step by step



<br /><br />
* Cheatsheet
```
| blah blah blah: |
| ***             |
| paragraph       |
| ***             |
```



<br /><br />
### UI
<img src="https://github.com/jrhe123/gpt-next/assets/17329299/5f931286-e6bd-4778-b403-87b62c54e1da"  width="150"><br />


<br /><br />
