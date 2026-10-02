This project is to help sales reps calculate the appropriate number of tokens for a given M2M integration. It is based on the Auth0 documentation for [Machine to Machine Token Lifetime](https://auth0.com/docs/tokens/machine-to-machine-tokens/token-lifetime).

We are accounting for 2 scenarios:

A - The customer has a known number of connections, a known number of days, and a known buffer percentage to account for Dev/Staging tenants or API cluster reboots. 

B - The customer has a known number of API calls per month and a known token lifetime. 

Reps will see the estimated number of tokens, and the appropriate Auth0 SKU.