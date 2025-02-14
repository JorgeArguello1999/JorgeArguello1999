# My Website (Don't merge this branch)

## Start project (Deploy)
```bash
./build.sh
```

## Start project (Develop)
```
pip install -r requirements.txt 

python manage.py migrate

# Create a .env file

python manage.py runserver
```

```bash
DJANGO_KEY="Your secret key for Django"
DEBUG=True
```