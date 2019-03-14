FROM nginx:1.15

MAINTAINER Richard Tian <richard_tianke@qq.com>

ADD nginx/nginx.conf /etc/nginx/nginx.conf
ADD nginx/conf.d /etc/nginx/conf.d
ADD nginx/rewrite /etc/nginx/rewrite
ADD nginx/sites-available /etc/nginx/sites-available
COPY src /usr/share/nginx/html

WORKDIR "/usr/share/nginx/html"

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]