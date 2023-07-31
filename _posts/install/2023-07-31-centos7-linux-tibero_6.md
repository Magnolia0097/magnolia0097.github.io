---
layout: post
title: Tibero_6_Linux_Install
---

<br>

### 파일 준비

1. 바이너리 실행 파일 (tar.gz)
2. 라이선스 파일(license.xml)

    라이선스 파일은 티베로 홈페이지에서 발급 후 계정에 등록된 메일로 전송된다

<br>

### 환경 변수 설정

{% highlight linux %}
export TB_HOME=/home/tibero/Tibero/tibero6
export TB_SID=tibero
export LD_LIBRARY_PATH=$TB_HOME/lib:$TB_HOME/client/lib
export PATH=$PATH:$TB_HOME/bin:$TB_HOME/client/bin
{% endhighlight %}

경로는 자신에게 맞게 설정

<br>

### 설치

- 원하는 디렉터리에 (tar.gz) 파일 압축 해제

- 발급받은 라이센스 파일  `$TB_HOME/license` 에 복사

- `$TB_HOME/config` 디렉터리에서 다음의 명령어를 입력
    {% highlight linux %}
    gen_tip.sh

    아래와 같은 메시지가 뜨면 성공

    Using TB_SID "tibero"
    /home/tibero/Tibero/tibero6/config/tibero.tip generated
    /home/tibero/Tibero/tibero6/config/psm_commands generated
    /home/tibero/Tibero/tibero6/client/config/tbdsn.tbr generated.
    Running client/config/gen_esql_cfg.sh
    Done.
    {% endhighlight %}

- 다음 명령어로 'NOMOUNT 모드'로 기동
    {% highlight linux %}
    tbboot nomount
    {% endhighlight %}

- 데이터베이스 접속
    {% highlight linux %}
    tbsql sys/tibero
    {% endhighlight %}

- 데이터베이스 생성
{% highlight linux %}
SQL> create database "tibero"
    user sys identified by tibero
    maxinstances 8
    maxdatafiles 100
    character set MSWIN949
    national character set UTF16
    logfile
        group 1 'log001.log' size 100M,
        group 2 'log002.log' size 100M,
        group 3 'log003.log' size 100M
    maxloggroups 255
    maxlogmembers 8
    noarchivelog
        datafile 'system001.dtf' size 100M autoextend on next 100M maxsize unlimited
        default temporary tablespace TEMP
            tempfile 'temp001.dtf' size 100M autoextend on next 100M maxsize unlimited
            extent management local autoallocate
        undo tablespace UNDO
            datafile 'undo001.dtf' size 100M autoextend on next 100M maxsize unlimited
            extent management local autoallocate;
Database created.
SQL> quit
    Disconnected.
{% endhighlight %}

- 생성 완료 후 `tbboot` 명령어로 재기동

- $TB_HOME/scripts 디렉터리에서 system.sh 셸을 실행

- `ps -ef | grep tbsvr` 정상 실행 확인