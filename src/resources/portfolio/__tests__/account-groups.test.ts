import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { Environment } from '../../../environment.ts'
import { HTTPClient } from '../../../http-client.ts'
import { AccountGroupResource } from '../../portfolio/account-group-resource.ts'
import { ClientResource } from '../../portfolio/client-resource.ts'

describe('AccountGroupResource', () => {
  const token = Environment['SAXOBANK_API_AUTHORIZATION_BEARER_TOKEN']
  if (token === undefined) {
    throw new Error('No token provided')
  }

  const prefixURL = Environment['SAXOBANK_API_PREFIX_URL']
  if (prefixURL === undefined) {
    throw new Error('No prefix URL provided')
  }

  const httpClient = HTTPClient.withBearerToken(token)

  const clientsResource = new ClientResource({ client: httpClient, prefixURL })
  const accountGroupsResource = new AccountGroupResource({ client: httpClient, prefixURL })

  test('accountGroups', async () => {
    const client = await clientsResource.me() // the only way we can get a known client key is to lookup the current client

    const accountGroups = await accountGroupsResource.accountGroups({ clientKey: client.ClientKey })

    expect(accountGroups).toBeDefined()
  })

  test('accountGroup', async () => {
    // todo find a way to test this (saxo simulation environment does not have any account groups)
  })

  test('me', async () => {
    const me = await accountGroupsResource.me()

    expect(me).toBeDefined()
  })
})
