FROM golang:1.18-bullseye

RUN apt update &\
    apt upgrade -y

# install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install -y nodejs

# isntall yarn
RUN corepack enable

# build chronograf package
# RUN go get github.com/influxdata/chronograf
# WORKDIR $GOPATH/src/github.com/influxdata/chronograf
# COPY ./autoRefreshOptions.ts $GOPATH/src/github.com/influxdata/chronograf/ui/srd/shared/components/dropdown_auto_refresh/autoRefreshOptions.ts
# RUN make
RUN git clone https://github.com/influxdata/chronograf.git /chronograf
WORKDIR /chronograf
COPY ./autoRefreshOptions.ts /chronograf/ui/src/shared/components/dropdown_auto_refresh/autoRefreshOptions.ts
RUN make

# install chronograf package
RUN go install github.com/influxdata/chronograf/cmd/chronograf

CMD ["sh", "-c", "$GOPATH/bin/chronograf"]
