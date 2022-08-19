<p align="center">
    <img src="apps/web/public/logo.svg" height="100px" />
    <h2 align="center">What is Abuse Sleuth?</h2>
</p>

Abuse Sleuth is a free-to-use data analyse platform for IP Address related information. This platform's intended use is to gather data from multiple data sources and be able to aggregate it, so that it can determine is the IP Address is currently being used for malicous intent or if it is still being used for malicious intent. Network Admins, System Admins and Blue Team Security Experts will be able to use this tool to be able to block or blacklist IP Addresses that have been hitting there firewall or IPS (Intrusion Prevent System).

## What is the current progress?

-   [ ] Collect Singular IP Address
-   [ ] Collect Multiple IP Addresses from Logs
-   [ ] Create Report Based on Scanned Logs
-   [ ] View Reports
-   [ ] View Informative Data about Reports
-   [ ] View Individual IP Address Profiles
-   [ ] Export CSV of expected Malicous IP Addresses

!! Nothing is done bc of V2 rebuild.

## Who made this tool and why?

The Creator of Abuse Sleuth (Myself, Abyss) is a Cyber Security Apprentice working within the Cyber Security industry. I have made lots of undocumented projects over the years and have been developing my Software Engineering skill to make progressively more advanced tooling with in the Cyber Security sector. I made this tool as the company I am employed for has a slow and time wasting task of looking through 24 hours worth of IPS logs and picking 10 IP Addresses that were deemed malicous, via research and usages of public tools, to be blocked, I saw this as an area that need improving, so I developed IP Sentinel V1 which was a roughly 150 line Python Script that was about to take our usual 70 IPs per week to 300-700+ IPs per week, this was a amazing leap forward in automating a workflow that was too intensive, but while using this there were feature in the software that were desired to be added and a simple python script was not going to cut it, so here I am now developing Abuse Sleuth (IP Sentinel V2).

## Tech Stack

### General

-   NodeJS - Runtime Engine
-   TypeScript - Language
-   TurboRepo - Monorepo and Building Management
-   Eslint - Linter
-   Prettier - Formatter
-   Husky - Git Hooks

### Infrastructure

-   Pulumi - IaC (Infrastructure as Code) Provisioning Resources
-   AWS - Cloud Provider

### Frontend

-   NextJS - SSR React Frontend
-   Mantine - UI Component Library

### Backend

-   Prisma - ORM
-   Fastify - API Framework
-   tRPC - E2E Type Safe API "helper/framework"
-   Postgres - SQL Database

### Testing

-   Jest - Unit Testing
-   Cypress - E2E Testing

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

## License

[GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/)
