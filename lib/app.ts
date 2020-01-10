import * as loader from '@grpc/proto-loader'
import * as grpc from 'grpc'

const protodef = loader.loadSync('./lib/app.proto');
const proto = grpc.loadPackageDefinition(protodef);
const app = new grpc.Server();
app.addService((proto.Greeter as any).service, {
    hello: function (call: grpc.ServerUnaryCall<any>, callback: grpc.sendUnaryData<any>) {
        callback(null, { message: `hello ${call.request.name}` });
    },
});
app.bind('localhost:55555', grpc.ServerCredentials.createInsecure());
app.start();

//client
const client: grpc.Client = new (proto.Greeter as any)('localhost:55555', grpc.credentials.createInsecure());
client.waitForReady(3000, function (e) {
    const stub: any = client;
    stub.hello({ name: 'xxx' }, function (e: Error, reply: any) {
        e ? console.error(e) : console.info(reply);
        app.tryShutdown(function () { });
    });
});