# Welcome Contributors

In this documentation I will go over exactly how this application is structured both on the files and directories in this code base, how each part of the software communicates relates and modularizes, and the technologies used.

I will split these sections into the 3 major parties involved in creating the complete world of the application

1. The landing page and documentation site. Basically the face and advertisement of the application itself
2. The application itself
3. The server connected to the application

## Table of Contents

**Landing Page**

- [Web](#web)
  - [Main Rules](#main-rules)
  - [app/ Dir Rules](#app-dir-rules)
    - [Creating Routes](#creating-routes)
  - [components/ Dir Rules](#components-dir-rules)
    - [Creating Directories Within Components Dir](#creating-directories-within-components-dir)
    - [Creating components](#creating-components)
  - [public/ Dir Rules](#public-dir-rules)
    - [Nested Assets Dirs](#nested-assets-dirs)
  - [page.tsx File Rules](#pagetsx-file-rules)
    - [Project Directory](#project-directory)
  - [Purposes, Layout, Guidelines](#purposes-layout-guidelines)
    - [page/component.tsx Code Structure](#pagecomponenttsx-code-structure)
      - [Code Example](#page-code-example)
    - [Prettier Settings to Configure](#prettier-settings-to-configure)
      - [Code Example](#prettier-config-code-example)

**Application**

- [Calendar Next Gen App](#calendar-next-gen-app)

## Web

**This is a Nextjs app router static website written in TypeScript**

This directory within the code base contains all of the static site code for advertising, developing better SEO and optimization and the documentation for the application

**"/Calendar-Next-Gen/web/\*"**

[Go to the dir ->](https://github.com/RyanLarge13/Calendar-Next-Gen/web)

For this website I have listed the frameworks and libraries used for development

| Framework | Libraries     |
| --------- | ------------- |
| Nextjs    | Framer Motion |
| --------- | Tailwind css  |
| --------- | Post CSS      |
| --------- | Auto Prefixer |
| --------- | TypeScript    |

- Next -v @latest
- Framer Motion -v 10.16.4
- Tailwindcss -v @latest
- Auto Prefixer -v @latest
- Post CSS -v @latest
- TypeScript -v @latest

### Main Rules

1. No new directories can be created without pre-review except within the app/ directory to create a new route or within public/assets to organize videos/images/etc..
2. This is a fully static site no api/ directory will be created or requests to any backend service

### app/ Dir Rules

#### Creating Routes

1. Create as many routes/nested routes as necessary to provide orginization and structure for the user that pertains to the application
2. Make sure the main Navigation and route layout navigations are properly updated to include your route if necessary
3. Use solid user friendly and developer friendly route names

### components/ Dir Rules

#### Creating Directories Within Components Dir

1. If organizing the components into sub directories is necessary, create one and place your component within it.
2. Name your directory with a meaningful and clear Name

#### Creating components

1. Your component must be in TypeScript
2. You must keep your component a server component unless you absolutely have to
3. Do not overdue components. The purpose of creating a component in this directory is to have a global place to put reusable pieces throughout the application. If the component is not going to be reused then create it within the page.tsx file or hardcore the tsx within your page component.

### public/ Dir Rules

#### Nested Assets Dirs

1. If there is no directory for a new type of media file, create one and place your new asset within it
2. Do not place assets in the global scope of the public/ dir

### page.tsx File Rules

1. Your page component must be a server component.
2. If there absolutely must be an interactive client side element create a new component and specify "use client" in its file
3. Your page must have dynamic meta data relevant to the page the user will be viewing
   **- A relavent title**
   **- A relavent description**

#### Project Directory

- **app**
  - **route**
  - **route**
  - **...**
  - `globals.css`
  - `favicon.svg`
  - `layout.tsx`
  - `page.tsx`
- **components**
  - `component.tsx`
  - `...`
- **public**
  - **assets**
    - `image.png/svg/jpg`
    - `...`
- `README.md`
- `tailwind.config.ts`
- `next.config.js`
- `...configs`

### Purposes, Layout, Guidlines

We are using the app directory in Nextjs for this project.

We are using TypeScript as the language of choice.

#### "web/\*"

##### Nextjs

We are using Nextjs app router because of the ease and maintainability when leveraging a file based routing system. This dissolves the need for routers and defining a routing structure from scratch.

##### TypeScript

We are using TypeScript in this project. No js pages or components are allowed to be used except with pre-approval

##### Tailwindcss

We are using tailwind for styling this website. This helps create outstanding maintainability. You are welcome to create reusable styles within a utils/ folder in the root directory.

**No css files or modules should be created. Only globals.css should contain traditional css**

#### "web/app/\*"

##### Route/

Adhere to all standard file naming conventions for readability and orginization

##### layout.tsx

You are welcome to define a new layout.tsx file to maintain global components within a parent route

##### page.tsx

Each page will be sent from the server and contain dynamic meta data. The purpose of this is to develop optimal SEO performance

#### "web/components/\*"

In this directory only create component files you know will be reused in more than one place within the app directory or within a layout.tsx file.

If you absolutely have to have a client component you can use this directory to create it as well

#### "web/public/\*"

This is where our assets will be placed for now and nothing else

### page/component.tsx Code Structure

Here I will give rules in layout, formatting and structure for a component that needs to be adhered to when contributing to this code base

#### page code example

```
// app/Home/page.tsx

// if client component, define "use client" at very top before everything else

//Define you imports grouping in this order
//1. imports from react
//2. imports from libraries
//3. imports from next
//4. imports from context/utils/data/assets
import Image from "next/image";
import HeaderImg from "../public/assets/headerImg.svg";

//Define your meta data above types
export const metadata = {
	title: "test",
	description: "test"
}

//Define your types here below imports
type Param = {
	text: string;
};

//Name the component that of the folder name you created for this route if this is a page.tsx file
//use arrow function syntax
const Home = ({param}: Param) => {

//in client components declair state, context, refs, constants and else up here
const [state, setState] = useState(null);

//Define functions above your return statement and below your states
const foo = () => {
  return;
};

  return (
    <main>
      <section className="relative text-white bg-black pt-20 h-screen min-h-[600px] flex flex-col justify-end items-start">
        <Image
          src={HeaderImg}
          alt="header background"
          className="absolute object-cover opacity-50"
        />
        //use callbacks within react event listener props
        <button onClick={() => foo()}>
          Test
        </button>
      </section>
    </main>
  );
};

//Define the default export at the very bottom
export default Home;
```

### prettier settings to configure

#### prettier config code example

```
{
  "singleQuote": false,
  "semi": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "always",
  "jsxBracketSameLine": true,
  "overrides": [
    {
      "files": ["*.tsx", "*.ts"],
      "options": {
        "parser": "typescript"
      }
    }
  ]
}
```

## Calendar Next Gen App

**This is a Frontend progressive web application built with React and written in Javascript**

This directory within the code base contains all of the application code for Calendar Next Gen. This is the actual code that runs the app and is seperate from the server and landing page

**"/Calendar-Next-Gen/src/\*"**

[Go to the dir ->](https://github.com/RyanLarge13/Calendar-Next-Gen/src)

For this application I have linked to the frameworks and libraries used for development and production in the package.json file

[package.json](https://github.com/RyanLarge13/Calendar-Next-Gen/src/package.json)
