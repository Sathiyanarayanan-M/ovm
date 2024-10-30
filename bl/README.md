# OVM SERVER

A guessing game with Next.js and Python

## Description

OVM is a fun game where one player draws something and others try to guess what it is as quickly as possible. Points are awarded based on how fast the guesses come in.


## Getting Started

### Dependencies

* Create a postgress server on your local

* import `./migrations/init.sql` migrations on your local

* To add words in words Table
    * Create a csv file in `./static/words/` folder with list of words in the below format(No headers and no empty row or column)

    | WORD          | COUNT         | 
    | ------------- |:-------------:| 
    | EYE      | 3 |
    | BASE     | 4      |
    | ball | 4      |

    * Run the addWords script
    ```
    python3 addWords.py
    ```
    * Enter the file name after that
    ```
    ENTER CSV FILENAME
    initial.csv 
    ```


### Installing

* Create a virtual environment (Recommended)
```
python3 -m venv .venv
```
* Activate Virtual Environment
```
source .venv/Scripts/activate
```
* Export Environment Variables
```sh
export DB_HOST=localhost DB_NAME=ovm DB_USERNAME={YOUR_DB_USERNAME} DB_PASSWORD={YOUR_DB_PASSWORD} ENVIRONMENT=development
```

### Executing program

* Run the below command on the virtual environment to start the backend server
```
python3 app.py
```

## Authors
Sathiya Narayanan  
[@Sathiyanarayanan-M](https://github.com/Sathiyanarayanan-M)

## Version History
* 0.1
    * Initial Release

## License

This project is licensed under the [MIT License](./LICENSE.txt).