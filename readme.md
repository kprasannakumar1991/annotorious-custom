# Basic information about Annotorious

Annotorious is an Open Source image annotation toolkit written in JavaScript. Online demos are available
[on their project Website](http://annotorious.github.io).

# My modifications
Annotorious library uses a text-area for the user to add annotations.
This project uses drop-down-menu instead of text-area.
Kindly add your drop-down options in templates/core_elements.soy, and compile the code

# How to compile
*Java should be installed in your local machine*
After downloading or cloning this project go to the root folder and run the below command.
**$java -jar plovr/plovr.jar build standalone.json > annotorious_dropdown.min.js**

# Use the generated file in your javascript application
copy the annotorious_dropdown.min.js file inside your javascript application .

## License
Annotorious is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). In short: Annotorious is delivered 'as is', and you can feel
free to use it wherever or however you want. Needless to say: if you fix a bug, or add a cool feature, be sure to give back to the community.
