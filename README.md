# Pug-Templates

This is a command-line tool to generate templates from Pug files into a single JavaScript file for use in browsers.

## Installation

	npm install -g pug-templates

## Usage Examples
 
	$ pug-templates [files...] [options]
  
  Options:

    -V, --version          output the version number
    -d, --dir <directory>  Directory that holds the Pug files
    -o, --out <output>     The output file path
    -h, --help             output usage information

  Examples:

      # complie given Pug files and output templates to destination file:
      $ pug-templates file1.pug file2.pug --out ./outputs/templates.js

      # compile the content of the directory and output templates to destination file:
      $ pug-templates --dir ./examples/ --out ./outputs/templates.js

After generating the `templates.js` you are ready to use it in your HTML files as:

    <!DOCTYPE html>
    <html>
    <head>
      <title>Example</title>
      ...
    </head>
    <body>
      <div></div>
      <script type="text/javascript" src="/path/to/your/templates.js"></script>
      <script type="text/javascript">
        ...
        var templateHtml = PUG_TEMPLATES["{template file name}"]( yourDataObject );
        ...
      </script>
    </body>
    </html>

Thats it :)
