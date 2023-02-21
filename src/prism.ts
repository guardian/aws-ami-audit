import type {
	PrismImage,
	PrismImagesResponse,
	PrismInstance,
	PrismInstancesResponse,
} from './types';

const PRISM_URL = 'https://prism.gutools.co.uk';

async function prismRequest<T>(path: string): Promise<T> {
	const url = `${PRISM_URL}/${path}`;
	console.log(`Making request to ${url}`);
	const request = await fetch(url);
	return (await request.json()) as T;
}

export async function getPrismImages(): Promise<PrismImage[]> {
	const response = await prismRequest<PrismImagesResponse>('images');
	return response.data.images;
}

export async function getPrismInstances(): Promise<PrismInstance[]> {
	const response = await prismRequest<PrismInstancesResponse>('instances');
	return response.data.instances;
}
