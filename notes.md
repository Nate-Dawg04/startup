# CS 260 Notes

[My startup - Procrastinot](http://procrastinot.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

# Git + Workflow Help
## Workflow
```
git pull
// Make changes to code
git commit -am "Message here
git push
```

**When getting changes from Github on VS Code:**
```
git fetch
git status
git pull
```

## Helpful git commands:
```
git status                  //current status of project
git push                    //push changes to repository
git pull                    //receive new changes made by others or on github website
git add .                   //adds all files to the current commit
git commit -m "Text here"   
git commit -am              //same as last one but also adds the files to the push
```

## AWS

My IP address is: *52.71.57.242*\
My key pair is called "WebKey.pem" and is saved in my Downloads folder

### Command to remove shell into my server:
```
ssh -i ~/Downloads/WebKey.pem ubuntu@52.71.57.242
```

> [!IMPORTANT]
> **Instance type:** t3.micro
> 
> **AMI ID:** ami-018f3a022e128a6b2
> 
> **Launch Time:** Wed Sep 10 2025 10:44:57

### HTTPS and TLS
**HTTP** -> Non-secure Hypertext Transport Protocol\
**HTTPS** -> Secure Hypertext Transport Protocol


*Let's Encrypt* and the IETF standard ACME protocol that they pioneered allow anyone who owns a domain name to dynamically generate and renew a certificate for free.

View negotation that happens with TLS example:
```
curl -v -s https://byu.edu > /dev/null
```
Visual Diagram:

![Certification Example](CertificationExample.jpg)

## Caddy
Caddy is a web service that listens for incoming HTTP requests. Caddy then either serves up the requested static files or routes the request to another web service. This ability to route requests is called a gateway, or reverse proxy, and allows you to expose multiple web services (i.e. your project services) as a single external web service (i.e. Caddy).

![Caddy Diagram](https://github.com/webprogramming260/.github/blob/main/profile/webServers/caddy/webServersCaddy.jpg)

Configuring Caddy:
```
ssh -i ~/Downloads/WebKey.pem ubuntu@52.71.57.242
cd ~
vi Caddyfile
# opens a text editor, where you change the port 80 (HTTP) to my domain name

sudo service caddy restart
# restarts Caddy to implement changes and requires sudo (super user do) to elevate user for required rights
```

A proxy server acts as an intermediary between a client and a server. It handles requests and responses, often providing benefits like security, anonymity, load balancing, and caching.

A forward proxy sits in front of the client, forwards client requests to eternal servers, and is used for content filtering, hiding client identity, or bypassing restrictions

A reverse proxy sits in front of the server, handles incoming client requests and routes them to internal servers, and is used for load balancing, SSL termination, caching, and hiding backend architecture

![Forward and Reverse Proxy](https://github.com/webprogramming260/.github/blob/main/profile/webServers/caddy/proxyServers.png)

## HTML

HyperText Markup Language **(HTML)**

HTML elements are represented with enclosing tags that may enclose other elements or text. For example, the paragraph element, and its associated tag (p), designate that the text is a structural paragraph of text. When we talk about tags we are referring to a delimited textual name that we use to designate the start and end of an HTML element as it appears in an HTML document. Tags are delimited with the less than (<) and greater than (>) symbols. A closing tag will also have a forward slash (/) before its name.

Tags can have attributes that modify behavior or provide data

HTML defines a header ```(<!DOCTYPE html>)``` that tells the browser the type and version of the document. You should always include this at the top of the HTML file.

The two major purposes of HTML is to provide structure and content to your web application. Some of the common HTML structural elements include body, header, footer, main, section, aside, p, table, ol/ul, div, and span

Creating everything for the HTML Files was honestly a bit tedious and not the most exciting. Very practical though.

## CSS

Cascading Style Sheets **(CSS)**
With CSS a web programmer can animate the page, deploy custom fonts, respond to user actions, and dynamically alter the entire layout of the page based on the size of a device and its orientation.

Functionally, CSS is primarily concerned with defining rulesets, or simply rules. A rule is comprised of a selector that selects the elements to apply the rule to, and one or more declarations that represent the property to style with the given property value.

![Css Website Rules](https://github.com/webprogramming260/.github/blob/main/profile/css/introduction/cssDefinitions.jpg?raw=true)

## Associating CSS with HTML
1. Use the style attribute of an HTML element and explicitly assign one or more declarations.
```
<p style="color:green">CSS</p>
```
2. Use the HTML style element to define CSS rules within the HTML document. The style element should appear in the head element of the document so that the rules apply to all elements of the document.
```
<head>
  <style>
    p {
      color: green;
    }
  </style>
</head>
<body>
  <p>CSS</p>
</body>
```
3. Use the HTML link element to create a hyperlink reference to an external file containing CSS rules. The link element must appear in the head element of the document.
```
<link rel="stylesheet" href="styles.css" />
```

All of the above examples are equivalent, but using the link element usually is the preferred way to define CSS.

CSS defines everything as boxes. When you apply styles, you are applying them to a region of the display that is a rectangular box. Within an element's box there are several internal boxes:
**Innermost Box** - Element's content (text or image of an element, etc. is displayed)
**Next Box** - Padding (inherits things like the background color)
**Next Box** - Border (has properties like color, thickness and line)
**Margin** - considered external to the actual styling of hte box and therefore only represents whitespace

## Selectors
Selectors are used to select the elements that a CSS Rule applies to.
Here are the different forms:

**1. Element Type Selector**  
Selects a 
Selects an element (like <body>) and cascades teh declaration down to all the children of the body, which is the whole document.
Example:
```
body {
  font-family: sans-serif;
}
```

"*" is the the wildcard element name selector

**2. Combinators**  

Types of Combinators
**Descendant** ->	A list of descendants ->	```body section``` ->	Any section that is a descendant of a body
**Child** -> A list of direct children ->	```section > p``` -> Any p that is a direct child of a section
**General sibling** -> A list of siblings -> ```div ~ p``` ->	Any p that has a div sibling
**Adjacent sibling** ->	A list of adjacent sibling ->	```div + p``` ->	Any p that has an adjacent div sibling

**3. Class Selector**  

**4. ID Selector**  

**5. Attribute Selector**  

**6. Pseudo Selector**  




------------Default Stuff---------------------

This took a couple hours to get it how I wanted. It was important to make it responsive and Bootstrap helped with that. It looks great on all kinds of screen sizes.

Bootstrap seems a bit like magic. It styles things nicely, but is very opinionated. You either do, or you do not. There doesn't seem to be much in between.

I did like the navbar it made it super easy to build a responsive header.

```html
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand">
            <img src="logo.svg" width="30" height="30" class="d-inline-block align-top" alt="" />
            Calmer
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" href="play.html">Play</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="about.html">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="index.html">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
```

I also used SVG to make the icon and logo for the app. This turned out to be a piece of cake.

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0066aa" rx="10" ry="10" />
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="72" font-family="Arial" fill="white">C</text>
</svg>
```

## React Part 1: Routing

Setting up Vite and React was pretty simple. I had a bit of trouble because of conflicting CSS. This isn't as straight forward as you would find with Svelte or Vue, but I made it work in the end. If there was a ton of CSS it would be a real problem. It sure was nice to have the code structured in a more usable way.

## React Part 2: Reactivity

This was a lot of fun to see it all come together. I had to keep remembering to use React state instead of just manipulating the DOM directly.

Handling the toggling of the checkboxes was particularly interesting.

```jsx
<div className="input-group sound-button-container">
  {calmSoundTypes.map((sound, index) => (
    <div key={index} className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        value={sound}
        id={sound}
        onChange={() => togglePlay(sound)}
        checked={selectedSounds.includes(sound)}
      ></input>
      <label className="form-check-label" htmlFor={sound}>
        {sound}
      </label>
    </div>
  ))}
</div>
```

This is a test line
