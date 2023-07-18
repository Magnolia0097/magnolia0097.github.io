---
layout: post
title: Oracle_Linux_Install
---

<br>

### 필요한 패키지 설치

{% highlight linux %}
yum update

yum install -y binutils compat-libcap1 gcc gcc-c++ glibc glibc-devel ksh compat-libstdc++-33 libaio libaio-devel libgcc libstdc++ libstdc++-devel  libXi libXtst make sysstat zip unzip net-tools smartmontools
{% endhighlight %}

<br>
<br>
<br>

### 커널 파라미터 수정

- `/etc/sysctl.conf`

{% highlight linux %}
fs.file-max = 6815744
kernel.shmall = 2097152
kernel.shmmax = 4056393728
kernel.shmmni = 4096
kernel.sem = 250 32000 100 128
net.ipv4.ip_local_port_range = 9000 65500
net.core.rmem_default = 262144
net.core.rmem_max = 4194304
net.core.wmem_default = 262144
net.core.wmem_max = 1048586
{% endhighlight %}
<br>

- 파라미터 설정 반영
{% highlight linux %}
sysctl -p
{% endhighlight %}

<br>
<br>
<br>


### Oracle 사용자의 권한 설정

- `/etc/security/limits.conf`

{% highlight linux %}
oracle soft nproc 2047
oracle hard nproc 16384
oracle soft nofile 1024
oracle hard nofile 65536
oracle soft stack 10240
{% endhighlight %}
<br>
<br>
<br>


### 오라클 사용자/그룹 생성

{% highlight linux %}
groupadd oinstall
groupadd dba
useradd -g oinstall -G dba oracle
passwd oracle 
{% endhighlight %}
<br>

> 이름 / 그룹명 변경 가능

<br><br>
<br>


### 오라클 설치 디렉토리 생성

{% highlight linux %}
mkdir -p /opt/oracle12/app
mkdir -p /opt/oracle12/oraInventory

chown -R oracle:oinstall /opt/oracle12/app
chown -R oracle:oinstall /opt/oracle12/oraInventory

chmod -R 775 /opt/oracle12/app
chmod -R 775 /opt/oracle12/oraInventory

chmod g+s /opt/oracle12/app
chmod g+s /opt/oracle12/oraInventory
{% endhighlight %}
<br>

> 경로 변경 가능

<br>
<br>
<br>

### 오라클 환경 변수 설정
<br>

- `~/.bash_profile`

    오라클 계정으로 로그인 할 것
{% highlight linux %}
TMPDIR=$TMP; export TMPDIR
ORACLE_BASE=/opt/oracle12/app/; export ORACLE_BASE
ORACLE_HOME=$ORACLE_BASE/product/12.2.0/dbhome_1; export ORACLE_HOME
ORACLE_HOME_LISTNER=$ORACLE_HOME/bin/lsnrctl; export ORACLE_HOME_LISTNER
ORACLE_SID=orcl; export ORACLE_SID
LD_LIBRARY_PATH=$ORACLE_HOME/lib:/lib:/usr/lib:/usr/lib64; export LD_LIBRARY_PATH
CLASSPATH=$ORACLE_HOME/jlib:$ORACLE_HOME/rdbms/jlib; export CLASSPATHexport NLS_LANG=KOREAN_KOREA.AL32UTF8
PATH=$ORACLE_HOME/bin:$PATH:$HOME/.local/bin:$HOME/bin; export PATH
{% endhighlight %}
<br>

> ORACLE_SID는 하단 설치과정의 SID 설정과 다르면 안됨, 경로 설정 
주의

<br>
- 환경변수 적용
{% highlight linux %}
source ~/.bash_profile
{% endhighlight %}
<br>


### 오라클 소프트웨어 설치

<br>
오라클 설치파일 내부에 `response` 라는 디렉토리 안에 들어가서, 3개의 `.rsp` 파일 확인

{% highlight linux %}
cp stage/database/response/*.rsp ~/
{% endhighlight %}
<br>

- `~/db_install.rsp` 해당 파일을 열고 아래와 같이 값을 찾아 수정한다
{% highlight js %}
oracle.install.option=INSTALL_DB_SWONLY
UNIX_GROUP_NAME=oinstall
INVENTORY_LOCATION=/opt/oracle12/oraInventory
ORACLE_HOME=/opt/oracle12/app/product/12.2.0/dbhome_1
ORACLE_BASE=/opt/oracle12/app
oracle.install.db.InstallEdition=EE
oracle.install.db.OSDBA_GROUP=dba
oracle.install.db.OSOPER_GROUP=dba
oracle.install.db.OSBACKUPDBA_GROUP=dba
oracle.install.db.OSDGDBA_GROUP=dba
oracle.install.db.OSKMDBA_GROUP=dba
oracle.install.db.OSRACDBA_GROUP=dba
SECURITY_UPDATES_VIA_MYORACLESUPPORT=false
DECLINE_SECURITY_UPDATES=true
{% endhighlight %}
<br>

- 테스트
<br>

    설치 하기전 테스트
<br>
    {% highlight js %}
./runInstaller -silent -executePrereqs -responseFile ~/db_install.rsp
    {% endhighlight %}

    {% highlight js %}
테스트 도중 DISPLAY 오류가 뜬다면 다음과 같은 방법으로 해결 가능

    su - root
    vi /etc/profile
    export DISPLAY=:0 << 이 값을 아무곳에나 넣는다
    source /etc/profile 
    {% endhighlight %}
<br>
- 설치
<br>

    테스트에 문제 없을 경우 설치

{% highlight js %}
./runInstaller -waitforcompletion -showProgress -silent -responseFile ~/db_install.rsp
{% endhighlight %}
<br>

- 관리자 로그인 후, 아래의 스크립트 실행
<br>

{% highlight js %}
/opt/oracle12/oraInventory/orainstRoot.sh

/opt/oracle12/app/product/12.2.0/dbhome_1/root.sh
{% endhighlight %}
<br>



### 오라클 리스너 생성

<br>
- `netca.rsp` 내부 값 변경
{% highlight js %}
SHOW_GUI=false
{% endhighlight %}
<br>

- 실행
<br>
{% highlight js %}
netca /silent /responseFile ~/netca.rsp
{% endhighlight %}
<br>
- 리스너 동작 여부 확인
<br>
{% highlight js %}
lsnrctl status
{% endhighlight %}
<br>


### 오라클 데이터베이스 생성하기

<br>
- `dbca.rsp` 파일 값 변경
<br>
{% highlight js %}
gdbName=orcl
sid=orcl
databaseConfigType=SI
createAsContainerDatabase=TRUE
numberOfPDBs=1
pdbName=orapdb
useLocalUndoForPDBs= TRUE
pdbAdminPassword=PASSWORD
templateName=General_Purpose.dbc
sysPassword=PASSWORD
systemPassword=PASSWORD
emConfiguration=DBEXPRESS
storageType=FS
characterSet=AL32UTF8
listeners=LISTENER
databaseType=MULTIPURPOSE
automaticMemoryManagement=FALSE
totalMemory=1024
{% endhighlight %}
<br>
- dbca 실행
{% highlight js %}
dbca -silent -createDatabase -responseFile ~/dbca.rsp
{% endhighlight %}
<br>
- 테스트
{% highlight js %}
sqlplus / as sysdba
{% endhighlight %}
<br>
- 추가
{% highlight js %}
해당 명령어로 database로 이름 확인

select name from v$database;
{% endhighlight %}
<br>
{% highlight js %}
유저 생성시 주의

create user dba_jc identified by dbajcpassword;
ORA-65096: 해당 오류가 뜰 경우
{% endhighlight %}
<br>
{% highlight js %}
해당 명령어로 세션 변경후 다시 시도할것

alter session set "_ORACLE_SCRIPT"=true;
{% endhighlight %}
<br>
{% highlight js %}
dba_jc 에게 관리자급 권한 부여

grant connect, resource, dba to dba_jc;

COMMIT; << 변경 후 적용 필수
{% endhighlight %}
<br>