# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - img [ref=e6]
    - heading "Bir şeyler ters gitti!" [level=2] [ref=e8]
    - paragraph [ref=e9]: Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
    - generic [ref=e10]:
      - button "Tekrar Dene" [ref=e11] [cursor=pointer]
      - button "Ana Sayfa" [ref=e12] [cursor=pointer]
  - region "Notifications (F8)":
    - list
  - generic [ref=e17] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e18]:
      - img [ref=e19]
    - generic [ref=e22]:
      - button "Open issues overlay" [ref=e23]:
        - generic [ref=e24]:
          - generic [ref=e25]: "0"
          - generic [ref=e26]: "1"
        - generic [ref=e27]: Issue
      - button "Collapse issues badge" [ref=e28]:
        - img [ref=e29]
  - alert [ref=e31]
```