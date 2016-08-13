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

java -jar gemfire-sink-rabbit-1.0.2.RELEASE.jar --gemfire.region.region-name=RegionRaw --gemfire.json=true --gemfire.key-expression="payload.getField('uuid')" --spring.cloud.stream.bindings.input.destination=transform_geotuple --spring.cloud.stream.bindings.input.group=gemfire_rawjson --server.port=9020

java -jar gemfire-source-rabbit-1.0.2.RELEASE.jar --gemfire.cacheEventExpression=newValue --gemfire.region.region-name=RegionTopTen --spring.cloud.stream.bindings.output.destination=gemfire_topjson --server.port=9030

java -jar spring-cloud-stream-sink-stomp-0.0.1-SNAPSHOT.jar --logging.level.io.pivotal.spring.cloud.stream.sink=TRACE --spring.cloud.stream.bindings.input.destination=gemfire_topjson --spring.cloud.stream.bindings.input.group=stomp_topjson --stomp.topic=topten --stomp.withSockJS=true --server.port=9040

```

```
java -jar spring-cloud-stream-sink-stomp-multi-topic-0.0.1-SNAPSHOT.jar --logging.level.io.pivotal.spring.cloud.stream.sink=INFO --spring.cloud.stream.bindings.input.destination=transform_geotuple --spring.cloud.stream.bindings.input.group=stomp_raw_events --stomp.withSockJS=true --stomp.topicPath=/dropoffDistrictCode --server.port=9110
```