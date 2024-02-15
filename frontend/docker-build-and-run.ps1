docker build -t sechs-minuten-tagebuch:0.1.0 .
docker run -d -p 4000:80 --name sechs-minuten-tagebuch sechs-minuten-tagebuch:0.1.0