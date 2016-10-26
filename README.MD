# Real-time Top 10 Taxi Zones by Angular


----------
Quick Start
-------------

## Download

```
git clone https://github.com/komushi/ng-topten-taxi-zones
```

## Build & Start GUI

```
cd ng-topten-taxi-zones
bower install
npm install -g live-server
live-server
```



## Temp - remove to demo guide later
```
java -jar http-source-rabbit-1.0.2.RELEASE.jar --spring.cloud.stream.bindings.output.destination=http_raw --server.port=9000

java -jar spring-cloud-stream-processor-geocoding-reverse-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=http_raw --spring.cloud.stream.bindings.input.group=transform_geotuple --spring.cloud.stream.bindings.output.contentType=application/json --spring.cloud.stream.bindings.output.destination=transform_geotuple --properties.mongo.database=geojson --properties.mongo.collection=blocks --server.port=9010

java -jar spring-cloud-stream-processor-geocoding-reverse-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=http_raw --spring.cloud.stream.bindings.input.group=transform_geotuple --spring.cloud.stream.bindings.output.contentType=application/json --spring.cloud.stream.bindings.output.destination=transform_geotuple --properties.mongo.database=geojson --properties.mongo.collection=blocks --server.port=9011

java -jar gemfire-sink-rabbit-1.0.2.RELEASE.jar --gemfire.region.region-name=RegRaw --gemfire.json=true --gemfire.key-expression="payload.getField('uuid')" --spring.cloud.stream.bindings.input.destination=transform_geotuple --spring.cloud.stream.bindings.input.group=gemfire_rawjson --server.port=9020

java -jar gemfire-source-rabbit-1.0.2.RELEASE.jar --gemfire.cacheEventExpression=newValue --gemfire.region.region-name=RegRouteTopTen --spring.cloud.stream.bindings.output.destination=gemfire_toproute --server.port=9030

java -jar spring-cloud-stream-sink-stomp-0.0.1-SNAPSHOT.jar --logging.level.io.pivotal.spring.cloud.stream.sink=TRACE --spring.cloud.stream.bindings.input.destination=gemfire_toproute --spring.cloud.stream.bindings.input.group=gemfire_toproute --stomp.topic=toproute --stomp.withSockJS=true --server.port=9040
```

```
java -jar spring-cloud-stream-sink-stomp-multi-topic-0.0.1-SNAPSHOT.jar --logging.level.io.pivotal.spring.cloud.stream.sink=INFO --spring.cloud.stream.bindings.input.destination=transform_geotuple --spring.cloud.stream.bindings.input.group=stomp_raw_events --stomp.withSockJS=true --stomp.topicPath=/dropoffDistrictCode --server.port=9110
```

## Temp - remove to demo guide later

java -jar target/spring-boot-geode-server-0.0.1-SNAPSHOT.jar --properties.batchSize=5

## 1. Tokyo 23 Top Routes
## 1-1. Sending data and transfrom
```
java -jar http-source-rabbit-1.0.2.RELEASE.jar --spring.cloud.stream.bindings.output.destination=http_raw --server.port=9000

java -jar spring-cloud-stream-processor-geocoding-reverse-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=http_raw --spring.cloud.stream.bindings.input.group=transform_geotuple --spring.cloud.stream.bindings.output.contentType=application/json --spring.cloud.stream.bindings.output.destination=transform_geotuple --properties.mongo.database=geojson --properties.mongo.collection=blocks --server.port=9100
```

## 1-2. Sending data to Geode
```
java -jar gemfire-sink-rabbit-1.0.2.RELEASE.jar --gemfire.region.region-name=RegRaw --gemfire.json=true --gemfire.key-expression="payload.getField('uuid')" --spring.cloud.stream.bindings.input.destination=transform_geotuple --spring.cloud.stream.bindings.input.group=gemfire_rawjson --server.port=9200
```

## 1-3. Retrieving data from Geode and sending to Stomp
```
java -jar gemfire-source-rabbit-1.0.2.RELEASE.jar --gemfire.cacheEventExpression=newValue --gemfire.region.region-name=RegRouteTopTen --spring.cloud.stream.bindings.output.destination=gemfire_topoute --server.port=9300

java -jar spring-cloud-stream-sink-stomp-0.0.1-SNAPSHOT.jar --logging.level.io.pivotal.spring.cloud.stream.sink=TRACE --spring.cloud.stream.bindings.input.destination=gemfire_topoute --spring.cloud.stream.bindings.input.group=1 --stomp.topic=toproute --stomp.withSockJS=true --server.port=9400
```

## Demo - Tokyo 23 Taxi Events
## 2-1. Retrieving data and Sending to Stomp
```
java -jar spring-cloud-stream-sink-stomp-multi-topic-0.0.1-SNAPSHOT.jar --logging.level.io.pivotal.spring.cloud.stream.sink=INFO --spring.cloud.stream.bindings.input.destination=transform_geotuple --spring.cloud.stream.bindings.input.group=stomp_raw_events --stomp.withSockJS=true --stomp.topicPath=/dropoffDistrictCode --server.port=9210
```

## Demo - Tokyo 23 Taxi Events
## Retrieving data from Geode and sending to Stomp
```
java -jar gemfire-source-rabbit-1.0.2.RELEASE.jar --gemfire.cacheEventExpression=newValue --gemfire.region.region-name=RegDropoffDistrictTop --spring.cloud.stream.bindings.output.destination=gemfire_topdropoff --server.port=9310

java -jar spring-cloud-stream-sink-stomp-0.0.1-SNAPSHOT.jar --logging.level.io.pivotal.spring.cloud.stream.sink=TRACE --spring.cloud.stream.bindings.input.destination=gemfire_topdropoff --spring.cloud.stream.bindings.input.group=1 --stomp.topic=topdropoff --stomp.withSockJS=true --server.port=9410
```

