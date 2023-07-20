---
layout: post
title: Maria_8.0_Linux_Install
---
Maria 의 버전은 8.0

<br>

### 유저/그룹 생성 및 추가

{% highlight linux %}
groupadd dba
useradd mysql
passwd mysql
그룹명과 유저명은 자유변경

usermod -g dba mysql
-g 는 메인 그룹, -G는 보조그룹

chmod g+s /d1/d2/d3
관리자 계정으로 접속후 사용할 것
{% endhighlight %}

`vi /etc/group` 명령어로 그룹 확인할 수 있다

`id` 명령어를 통해 유저와 유저가 속한 그룹을 확인가능

`id` 사용 후 `context-unconfined_u:unconfined_r:unconfined_t:s0:c0.c1023` 이라는 정보가 보인다면, SELinux 가 활성화 된 것

SELinux 활성화가 된 것이 싫다면 ([SELinux 비활성화](/2023/07/19/linux-SELinux)) 해당 글을 참조

<br>
<br>
<br>

### 자바 확인

{% highlight linux %}
cd /usr/lib/jvm
안에 있다
{% endhighlight %}
<br>

{% highlight linux %}
원하는 자바 버전을 선택하여 환경설정 
~/.bash_profile 
또는
/etc/profile
(전역환경설정) 둘중 원하는 곳에 설정하자 

1. export JAVA_HOME="경로"
2. JAVA_HOME="경로";
    export JAVA_HOME 

둘중 아무 방식으로 기록
{% endhighlight %}

<br>


환경변수 설정 후에 `source ~/.bash_profile` or `source /etc/profile` 을 통해 저장할 것

또는 원하는 자바 버전을 직접 설치하여도 좋다

<br>

### Maria 설치

원하는 폴더 안에 압축해제
`tar xvf 마리아.tar` or `unzip 마리아.zip`

{% highlight linux %}
압축해제한 설치 파일 내부에서
cd support-files
vi mysql.server

mysql.server 내부의 
basedir=
(설치할 경로)
datadir= 
(data 저장 경로)
두 부분을 원하는 경로로 수정하자

ex)
basedir=/home/bmt/mysql
basedir=/home/bmt/mysql/data

{% endhighlight %}
<br>


### my.cnf 설정

my.cnf 를 찾는데 찾는 경로 우선순위는 
1. /etc/my.cnf
2. /etc/mysql/my.cnf
3. ~/.my.cnf

<br>

- 설정 방법

1. 설치할 경로 안에 있는 `my-huge.cnf` 을 우선순위 내의 경로에 `my.cnf` 라는 이름으로 복붙하거나    

2. 우선순위 경로에 `my.cnf` 라는 파일을 만들어 내용물을 채우거나 하면 됨

3. 설치폴터 내부에 있는 설치 프로그램에 따로 명령어롤 사용하여 경로를 지정하여 설정하면 된다

  

세가지중에 원하는 방법으로 하자

- my.cnf
{% highlight cmd %}
[client]
character-set=utf8
port            = 3306
socket          = /tmp/mysql.sock

[mysqld]
lower_case_table_names=1
character-set-server=utf8
default-storage-engine=MyISAM
port            = 3306
socket          = /tmp/mysql.sock
skip-external-locking
key_buffer_size = 384M
max_allowed_packet = 1M
table_open_cache = 512
sort_buffer_size = 2M
read_buffer_size = 2M
read_rnd_buffer_size = 8M
myisam_sort_buffer_size = 64M
thread_cache_size = 8
query_cache_size = 32M

thread_concurrency = 8
server-id       = 1

[mysqldump]
quick
max_allowed_packet = 16M

[mysql]
default-character-set=utf8
no-auto-rehash

[myisamchk]
key_buffer_size = 256M
sort_buffer_size = 256M
read_buffer = 2M

{% endhighlight %}

<br>


### Maria 설치 및 기동

{% highlight cmd %}
cd /home/bmt/mysql/scripts
경로는 무조껀 나와 다르다


mysql_install_db --user=mysql --basedir=/home/bmt/mysql --datadir=/home/bmt/mysql --defaults-file=/etc/my.cnf

또는 앞에 `./` 붙여서 사용하자

./mysql_install_db --user=mysql --basedir=/home/bmt/mysql --datadir=/home/bmt/mysql --defaults-file=/etc/my.cnf

이렇게


꼭 설정에 맞게 쓰자 mysql_install 이후의 -- 내용중에 뭐가 붙는지 잘 봐야 한다 

자기 내용에 맞게 바꿔야하니까
{% endhighlight %}
<br>

{% highlight cmd %}
./mysql.server start

해당 명령어로 DB 기동, 물론 `mysql.server` 이라는 파일이 있는곳에서 해당 명령어를 입력 해야한다 (/support-files)
{% endhighlight %}
<br>

{% highlight cmd %}
cd /home/bmt/mysql/bin
경로는 무조껀 다르다

bin 파일에 가면 `mysql` 이라는 파일이 있다

./mysql -u root
또는
./mysql -u root -p
로 기동한 DB 에 접속한다

비밀번호는 'root'

{% endhighlight %}

(선택) db 접속 전 해당 명령어를 통해 root 의 비밀번호를 변경할 수 있다
{% highlight cmd %}
mysqladmin –u root password root
{% endhighlight %}
<br>

(선택) db 접속 후 해당 명령어를 통해 유저의 비밀번호를 변경할 수 있다
{% highlight cmd %}
ALTER USER 'root'@'localhost' IDENTIFIED BY '새로운_비밀번호';

FLUSH PRIVILEGES;
저장
{% endhighlight %}
<br>

원하는 유저를 만들고
{% highlight cmd %}
CREATE USER 'username'@'host' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;

{% endhighlight %}
<br>

원하는 Database 를 만들고
{% highlight cmd %}
CREATE DATABASE 원하는데이터베이스이름;
FLUSH PRIVILEGES;
{% endhighlight %}
<br>

`만든유저이름` 에게 `만든데이터베이스이름` 이라는 DB의 관리자급의 모든 권한을 부여한다

권한 부여에는 여러 방법이 있다

<br>

1.
{% highlight cmd %}
GRANT ALL PRIVILEGES ON 만든데이터베이스이름.* TO '만든유저이름'@'host';
FLUSH PRIVILEGES;
{% endhighlight %}

<br>

해당 사용자는 비밀번호 없이 'host' 라는 호스트에서만 이 데이터베이스에 접속할 수 있다, 테이블의 수정,삭제,생성등 모든 작업 수행 가능

이 옵션을 다른 사용자에게 부여 불가

<br>

2.
{% highlight cmd %}
GRANT ALL PRIVILEGES ON 만든데이터베이스이름.* TO '만든유저이름'@'%' identified by "비밀번호";
FLUSH PRIVILEGES;
{% endhighlight %}

<br>

모든 호스트에서, 해당 사용자는 비밀번호를 입력해야만 이 데이터베이스에 접속할 수 있다, 테이블의 수정,삭제,생성등 모든 작업 수행 가능

이 옵션을 다른 사용자에게 부여 불가

<br>

3.
{% highlight cmd %}
GRANT ALL PRIVILEGES ON 만든데이터베이스이름.* TO '만든유저이름'@'%' identified by "비밀번호" with grant option;
FLUSH PRIVILEGES;
{% endhighlight %}

<br>

모든 호스트에서, 해당 사용자는 비밀번호를 입력해야만 이 데이터베이스에 접속할 수 있다, 테이블의 수정,삭제,생성등 모든 작업 수행 가능

이 옵션을 다른 사용자에게 부여 가능



`FLUSH PRIVILEGES;` 은 항상 해줘야 한다. 

모든 설정 후 한번에 `FLUSH PRIVILEGES;` 해도 된다

<br>


### 여기까지 하면 설치는 끝, 아래는 추가기능


<br>

유저와 호스트 확인가능 
{% highlight cmd %}
select user, host from mysql.user where user = ‘root’;
{% endhighlight %}

<br>

유저와 호스트에 디비까지 지정하여 접속 가능
{% highlight cmd %}
mysql -h 192.168.0.65 -u root -p performance_db

-h : 호스트
-u : DB 유저
-p : 비밀번호 입력하겠다
맨뒤에 : 해당 이름의 db로 접속하겠다
{% endhighlight %}

<br>

접근 가능한 DB 확인 가능
{% highlight cmd %}
show databases;
{% endhighlight %}

<br>

DBMS 접속 후 특정 DB 지정해서 연결 가능
{% highlight cmd %}
connect 사용할DB이름;
{% endhighlight %}

<br>

DBMS 접속해서 DB 지정했다면, 해당 명령어로 존재하는 테이블 확인 가능
{% highlight cmd %}
show tables;
{% endhighlight %}

<br>