import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ServiceBusClient } from "@azure/service-bus";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

    await serviceBusOutput(context, name);
};

const serviceBusOutput = async function (context: Context, msg: string) {
    // const message= {
    //     body: 'Service Bus queue message: ' + name,
    //     sessionId: '1'
    //     };
    // context.log(message);   
    // context.bindings.outputSbQueue = message;
    // context.done();
    context.log('serviceBusOutput');

    const queueName = "voucher";
    const sbClient = new ServiceBusClient(
        process.env.aiservivebus_SERVICEBUS
      );
    
    const sender = sbClient.createSender(queueName);
    const message= {
    body: msg,
    sessionId: '123'
    };
    await sender.sendMessages(message);
    
}


export default httpTrigger;