# AWS AMI Audit
A small script that uses Prism to audit in use AMIs.

## Process
1. List all instances in Prism
2. For each instance, find the AMI that was used to launch it
3. If the AMI has a `SourceAMI` tag, it was built by AMIgo. Else, assume it's a vanilla AMI provided by AWS
4. Lookup the AMI details
5. Output report to a CSV

## Running locally
1. Ensure you're using the correct Node version (see [.nvmrc](.nvmrc))
2. Install dependencies via `npm i`
3. Get AWS credentials from Janus for the `deployTools` account
4. Run `npm start`
