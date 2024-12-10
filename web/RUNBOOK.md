# Criar a imagem
```
docker build -t f3f3-custom-dify-web .
```
# Exporte a imagem em um arquivo tar
```
docker save -o f3f3-custom-dify-web.tar f3f3-custom-dify-web:latest
```
# Transfira a imagem para o servidor
```
scp f3f3-custom-dify-web.tar root@145.223.121.2:/home/root
```
#  Importe a imagem no servidor
```
docker load -i f3f3-custom-dify-web.tar
```
# Atualizar o docker-compose 
```
docker-compose up -d --no-deps --build web
```
