export interface PrismImage {
	arn: string;
	name: string;
	imageId: string;
	region: string;
	description: string;
	creationDate: string;
	architecture: string;
	tags: {
		SourceAMI?: string;
		Recipe?: string;
	};
	meta: {
		origin: {
			region: string;
			accountName: string;
			accountNumber: string;
		};
	};
}

export interface PrismImagesResponse {
	data: {
		images: PrismImage[];
	};
}

export interface PrismInstance {
	arn: string;
	vendorState: string;
	instanceName: string;
	region: string;
	createdAt: string;
	specification: {
		imageId: string;
		imageArn: string;
		instanceType: string;
	};
	tags: {
		Stack?: string;
		Stage?: string;
		App?: string;
		'gu:repo'?: string;
		'aws:cloudformation:stack-name'?: string;
		'aws:autoscaling:groupName'?: string;
	};

	meta: {
		origin: {
			region: string;
			accountName: string;
			accountNumber: string;
		};
	};
}

export interface PrismInstancesResponse {
	data: {
		instances: PrismInstance[];
	};
}

export interface CsvRow {
	InstanceId: string;
	InstanceLaunchedOn: string;
	InstanceType: string;
	Stack: string;
	Stage: string;
	App: string;
	Region: string;
	AccountNumber: string;
	AccountName: string;
	Repository: string;
	AutoScalingGroupName: string;
	CloudformationStackName: string;
	AmigoRecipeName: string;
	AmiCreatedOn: string;
	RootImageId: string;
	RootImageName: string;
	UbuntuVersion: string;
	RootImageDescription: string;
	RootImageArchitecture: string;
	RootImageLocation: string;
	RootImagePlatformDetails: string;
	RootImageCreatedOn: string;
	RootImageDeprecatedOn: string;
}
