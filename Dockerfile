FROM loadimpact/k6:0.26.1

ENV VUS=2 \
    SCRIPT=test.js \
    DURATION=5m \
    PROJECTNAME=Commerce \
    APINAME=ListMarkets \
    ENVNAME=QA

COPY ./scripts /scripts

WORKDIR /scripts

# Override the entry point of the base k6 image
ENTRYPOINT []
# CMD ["sh", "-c", "k6 run $SCRIPT --vus $VUS --out influxdb=http://104.40.213.24:8086/Volvo -e PROJECT=$PROJECT -e APINAME=$APINAME -e ENV=$ENVNAME"]

CMD ["sh", "-c", "k6 run --vus $VUS --duration $DURATION --out influxdb=http://104.40.213.24:8086/Volvo -e ENV=$ENVNAME -e PROJECTNAME=$PROJECTNAME -e APINAME=$APINAME $SCRIPT "]