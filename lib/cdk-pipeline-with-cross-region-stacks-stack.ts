import { Construct } from 'constructs';
import {pipelines, Stack, StackProps, Stage, StageProps} from "aws-cdk-lib";
import * as sns from 'aws-cdk-lib/aws-sns';

export class CdkPipelineWithCrossRegionStacksStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkPipelineWithCrossRegionStacksQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const pipeline = new pipelines.CodePipeline(this, "Pipeline", {
      pipelineName: "pipeline-with-cross-region-stacks",
      synth: new pipelines.ShellStep("Synth", {
        commands: ["npm ci", "npm run build", "npx cdk synth"],
        input: pipelines.CodePipelineSource.connection(
            "https://github.com/Leejjon/cdk-pipeline-with-cross-region-stacks",
            "master",
            {
                connectionArn: "arn:aws:codestar-connections:eu-central-1:039085306114:connection/010d9616-2ce5-4d82-a61d-75938f7b0deb"
            }
        ),
        primaryOutputDirectory: "cdk.out"
      })
    });

    pipeline.addStage(
        new SomeStage(this, "first-stage", {})
    )
  }
}

export class SomeStage extends Stage {
    constructor(scope: Construct, id: string, props: StageProps) {
      super(scope, id, props);

      new StackInEurope(this, "eu-stack", {})
      new StackInUnitedStates(this, "us-stack", { env: {region: "us-east-1"}})

    }
}

export class StackInEurope extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
      super(scope, id, props);

      new sns.Topic(this, "eu-topic", {

      })
    }
}

export class StackInUnitedStates extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new sns.Topic(this, "us-topic", {

    })
  }
}
