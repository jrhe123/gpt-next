# gpt-next (Language Learning Assistant POC)

### UI
<img src="https://github.com/jrhe123/gpt-next/assets/17329299/5f931286-e6bd-4778-b403-87b62c54e1da"  width="150"><br />

* Overview
```
       -------------------------➡|  OpenAI  |
      |                          |    API   |
      |                               |
      |                               |
      |                               ⬇  
      |            | VPS |     |Cloudflare worker|   |Cloudflare page|   | Vercel |
      |           ------------------------------------------------------------------
   | Proxy |              |   API Proxy  |                |   NextJS App   |
      ⬆
      |
      |
      |           |   Service   |
      ----------- |   gpt-next  |

```


<br /><br />
