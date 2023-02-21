import { writeFileSync } from 'fs';
import { parse } from 'json2csv';
import { getAmiDetails, getClient } from './ec2.js';
import { getPrismImages, getPrismInstances } from './prism.js';
import type { CsvRow } from './types';

const unknown = 'unknown';
function sleep(seconds: number) {
	return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const prismInstances = await getPrismInstances();
const prismImages = await getPrismImages();
const client = getClient();

console.log(`Total Prism instances: ${prismInstances.length}`);
console.log(`Total Prism images: ${prismImages.length}`);

function getUbuntuVersion(amiDescription?: string): string {
	if (!amiDescription) {
		return unknown;
	}
	if (amiDescription.startsWith('Canonical, Ubuntu')) {
		const [, , ubuntuVersion] = amiDescription.split(',');
		return (ubuntuVersion ?? unknown).trim();
	}
	return unknown;
}

const data = prismInstances.map(async (instance) => {
	const {
		specification: { imageId, instanceType },
		tags: { Stack, Stage, App },
		createdAt,
		instanceName,
		region,
		meta: {
			origin: { accountName, accountNumber },
		},
	} = instance;

	const repo = instance.tags['gu:repo'];
	const cfnStackName = instance.tags['aws:cloudformation:stack-name'];
	const asgName = instance.tags['aws:autoscaling:groupName'];

	const prismImage = prismImages.find((_) => _.imageId === imageId);
	const imageIdToLookUp = prismImage?.tags.SourceAMI ?? imageId;
	const amigoRecipe = prismImage?.tags.Recipe;
	const amiCreatedOn = prismImage?.creationDate;

	const {
		ImageId,
		Description,
		Architecture,
		CreationDate,
		ImageLocation,
		PlatformDetails,
		Name,
		DeprecationTime,
	} = await getAmiDetails(client, imageIdToLookUp);

	const data: CsvRow = {
		InstanceId: instanceName,
		InstanceLaunchedOn: createdAt,
		InstanceType: instanceType,
		UbuntuVersion: getUbuntuVersion(Description),
		Stack: Stack ?? unknown,
		Stage: Stage ?? unknown,
		App: App ?? unknown,
		Region: region,
		AccountNumber: accountNumber,
		AccountName: accountName,
		Repository: repo ?? unknown,
		AutoScalingGroupName: asgName ?? unknown,
		CloudformationStackName: cfnStackName ?? unknown,
		AmiCreatedOn: amiCreatedOn ?? unknown,
		AmigoRecipeName: amigoRecipe ?? unknown,
		RootImageId: ImageId ?? unknown,
		RootImageName: Name ?? unknown,
		RootImageDescription: Description ?? unknown,
		RootImageArchitecture: Architecture ?? unknown,
		RootImageLocation: ImageLocation ?? unknown,
		RootImagePlatformDetails: PlatformDetails ?? unknown,
		RootImageCreatedOn: CreationDate ?? unknown,
		RootImageDeprecatedOn: DeprecationTime ?? unknown,
	};

	// attempt to avoid being rate limited by AWS
	await sleep(2);

	return data;
});

const csvRows = await Promise.all(data);

writeFileSync('report.csv', parse(csvRows));

// Required for ESM modules with top level await
export {};
