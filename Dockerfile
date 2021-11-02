FROM loadimpact/k6:latest

ENV STAGES=5s:1,1m:3,10s:0 \
    SCRIPT=getListMarkets.js \
    PROJECT=Commerce \
    APINAME=ListMarkets \
    ENVNAME=QA

COPY ./scripts /scripts

WORKDIR /scripts

# Override the entry point of the base k6 image
ENTRYPOINT []

CMD ["sh", "-c", "k6 run --vus $VUS --duration $DURATION --out influxdb=http://104.40.213.24:8086/Volvo -e ENV=$ENVNAME -e PROJECTNAME=$PROJECTNAME -e APINAME=$APINAME $SCRIPT "]
