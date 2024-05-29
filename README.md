# API Documentation
## CSS
### Fetching CSS By IDs
```http request
GET /api/css?id=_&id=_&id=_...
```
Due to the length limitation of URL, do not retrieve more than 200 object at once.  
The response will be in the form of a json array of objects containing every information regarding the requested CSS objects.  
### Upload CSS
```http request
POST /api/css
Content-Type: application/json

{
  "userID": number,
  "password_hashed": string,
  "name": string,
  "html": string,
  "css": string,
  "category": string,
}
```
userID is the id of the creator of this CSS.  
password_hashed is the hashed password (sha256) of the user.  
name is the name of this CSS.  
html is the html portion of this CSS.  
css is the css portion of this CSS.  
category is the category of this CSS. Accepted categories includes:
- button
- checkbox
- toggle switch
- card
- loader
- input
- transition
- special effect
  
### Fetching IDs Of Existing CSS
```http request
GET /api/css/valid?category=_&limit=_&offset=_&order=_&order=_&order=_...
```

Return an array of numbers which are the ids of existing css.  
Query params used for filtering purpose, all of them can be ignored.  

### Validate User Password
```http request
GET /api/users/isvalid?id=_&email=_&password_hashed=_
```

Return whether the hashed (sha256) password provided is true/false.  
Only one of the identification query params (id/email) is required.  