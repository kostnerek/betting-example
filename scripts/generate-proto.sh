echo "pwd: $(pwd)"
protoc \
  --plugin=protoc-gen-ts_proto=node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=libs/common/src/types \
  --ts_proto_opt=nestJs=true \
  --ts_proto_opt=addGrpcMetadata=true \
  --ts_proto_opt=addNestjsRestParameter=true \
  --ts_proto_opt=returnObservable=true \
  --ts_proto_opt=useExactTypes=false \
  --ts_proto_opt=outputEncodeMethods=false \
  --ts_proto_opt=stringEnums=true \
  --ts_proto_opt=enumsAsLiterals=true \
  --ts_proto_opt=useNumericEnumForJson=false \
  --ts_proto_opt=unrecognizedEnum=false \
  --ts_proto_opt=useNullAsOptional=true \
  --ts_proto_opt=useNumericEnums=false \
  --ts_proto_opt=exportCommonSymbols=false \
  --proto_path=proto \
  proto/*.proto 

echo "Proto files generated successfully in src/proto/"
