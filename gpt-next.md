# gpt-next (Language Learning Assistant POC)

<img src="https://github.com/jrhe123/gpt-next/assets/17329299/5f931286-e6bd-4778-b403-87b62c54e1da"  width="150"><br />

* Basic
  * React
  * Typescript
* UI
  * Mantine UI (https://mantine.dev/)
  * Tailwind
* API
  * Vercel edge func
  * Cloudflare proxy
* Deploy
  * Github
  * Vercel  

<br /><br />


* Overview (Choose your cloud service)
```
       ------------------------ ⏩ |  OpenAI  | ⬅️ --------------------------
      |                -------- ⏩ |    API   |             |                |
      |               |                |                    |                |
      |               |                |                    |                |
      |               |                ⬇️                   |                |
      |            | VPS |     |Cloudflare worker|   |Cloudflare page|   | Vercel |
      |           ===================================================================
   | Proxy |                |   API Proxy  |              |   NextJS App   |
      ⬆️                           ⬆️                               ⬆️
      |                            |                                |
      |                            |                                |
      |                      |   Service   |                        |
       --------------------- |   gpt-next  | -----------------------
                                   🖥️
```

* Current setup
```

          |  OpenAI  | ⬅️---------------------------------------------------------------------------------
          |    API   |                                                                   |               |
               |                                | Domain |                               |               |
               |                             _______|___________        _________________|_______________|
               ⬇️                           ⬇️                  ⬇️      ⬇️                |                |
       |Cloudflare worker| -----⏩ |proxy.hejiarong.ca|  |chat.hejiarong.ca|    |Cloudflare page|   | Vercel |
================================================================================================================      
          | API Proxy |            (local dev)                                          (prod)       (prod)
               ⬆️                       ⬆️                                                 ⬆️           ⬆️
               |                        |__________________________________________________|___________|  
               |                                                                               ⬆️
          | gpt-next | ------------------------------------------------------------⏩  |   NextJS App   |
               🖥️
```

<br/><br/>
<img src="https://github.com/jrhe123/gpt-next/assets/17329299/46774b4e-7993-459c-90c3-e70225dd8b47"  width="600"><br />


<br /><br />
