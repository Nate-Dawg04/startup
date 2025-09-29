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

Types of Combinators:  
**Descendant** ->	A list of descendants ->	```body section``` ->	Any section that is a descendant of a body  
**Child** -> A list of direct children ->	```section > p``` -> Any p that is a direct child of a section  
**General sibling** -> A list of siblings -> ```div ~ p``` ->	Any p that has a div sibling  
**Adjacent sibling** ->	A list of adjacent sibling ->	```div + p``` ->	Any p that has an adjacent div sibling

Example:  
We can use the general sibling combinator to increase the whitespace padding on the left of paragraphs that are siblings of a level two heading.
```
h2 ~ p {
  padding-left: 0.5em;
}
```

**3. Class Selector**  
Any element can have zero or more classifications applied to it. If our document has a class of ```introduction``` applied to the first paragraph, and a class of ```summary``` applied to the final paragraph of each section. If we want to bold the summary paragraphs we would supply the class name summary prefixed with a period (```.summary```).
```
.summary {
  font-weight: bold;
}
```

**4. ID Selector**  
ID selectors reference the ID of an element. All IDs should be unique within an HTML document and so this select targets a specific element. To use the ID selector you prefix the ID with the hash symbol (#)  
Example:
```
#physics {
  border-left: solid 1em purple;
}
```

**5. Attribute Selector**  
Attribute selectors allow you to select elements based upon their attributes. You use an attribute selector to select any element with a given attribute (```a[href]```)  
Example:  
```
p[class='summary'] {
  color: red;
}
```

**6. Pseudo Selector**  
CSS also defines a significant list of pseudo selectors which select based on positional relationships, mouse interactions, hyperlink visitation states, and attributes.   
Example:
(Change our ID selector to select whenever a section is hovered over.)
```
section:hover {
  border-left: solid 1em purple;
}
```

## Declarations
CSS rule declarations specify a property and value to assign when the rule selector matches one or more elements. There are many many different possible properties
There are many different units to use to define size, as well as multiple ways to describe color


## Responsive Design
Modern web applications must adapt to many devices, which is achieved through responsive design—adjusting layouts based on screen size and orientation. While HTML and CSS are naturally flexible, properties like display (e.g., none, block, inline, flex, grid) allow control of how elements are rendered. The viewport meta tag ensure pages display correctly on mobile devices, and the float property allows text to wrap around elements. Media queries make it possible to dynamically change styles depending on device conditions like orientation. 

# React and JavaScript  

'''
const Hello = ({ phrase }) => {
  return (
    <div>
    <p> Hello {phrase}</p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<Hello phrase="cs260" />);
'''


------------Default Stuff---------------------

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
