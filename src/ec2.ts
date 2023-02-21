import type { Image } from '@aws-sdk/client-ec2';
import { DescribeImagesCommand, EC2Client } from '@aws-sdk/client-ec2';
import { fromIni } from '@aws-sdk/credential-providers';

export function getClient(): EC2Client {
	return new EC2Client({
		credentials: fromIni({ profile: 'deployTools' }),
		region: 'eu-west-1',
		maxAttempts: 10,
	});
}

const UnknownImage: Image = {};

export async function getAmiDetails(
	ec2Client: EC2Client,
	imageId: string,
): Promise<Image> {
	const command = new DescribeImagesCommand({
		ExecutableUsers: ['all'],
		ImageIds: [imageId],
	});

	try {
		const { Images = [] } = await ec2Client.send(command);

		if (Images.length > 0) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- asserted above
			return Images[0]!;
		} else {
			// This shouldn't happen
			return Promise.resolve(UnknownImage);
		}
	} catch (e) {
		const extra = e instanceof Error ? e.message : e;
		console.error(`Failed to get details for ${imageId}`, extra);

		return Promise.resolve(UnknownImage);
	}
}
