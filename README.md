# Request Module

![Build Status](https://github.com/janis-commerce/request/workflows/Build%20Status/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/request/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/request?branch=master)
[![npm version](https://badge.fury.io/js/%40janiscommerce%2Frequest.svg)](https://www.npmjs.com/package/@janiscommerce/request)

## 📦 Installation
```js
const { Request } = require('@janiscommerce/request');
```

| :warning: Migration :warning: |
| :--: |
| If you are using v1.x see the [migration guide](#running-migration) |

## :hammer: Usage

### Request example
Making a custom request. When the response status code is greater than or equal to 400 throws an error.

If you want to handle the error safely you can use `RequestSafe`

```js

try {

    const { statusCode, body } = await Request.get('https://reqres.in/api/users');

    console.log(`Status code: ${statusCode}`); // Status code: 200
    console.log(body); // { message: 'OK' }

} catch(error){

    console.log(error)

    /*
		{
			name: 'RequestError'
			message: 'Request failed: internal error',
			code: 1
		}
    */
}
```

### RequestSafe example
Making a custom safe request

```js
const { RequestSafe } = require('@janiscommerce/request');

const { statusCode, body } = await RequestSafe.get('https://reqres.in/api/users');

console.log(`Status code: ${statusCode}`); // Status code: 500
console.log(body); // { message: 'internal error' }
```

---

## ⚙️ Classes

<dl>
<dt><a href="#Request">Request</a></dt>
<dd><p>Simple static class to make external request using http and http node core packages</p>
</dd>
<dt><a href="#RequestSafe">RequestSafe</a></dt>
<dd><p>Extend from <a href="#Request">Request</a>. Its use is the same but not throw an error when the response status code is greater than or equal to 400</p>
</dd>
</dl>

## 📄 Structures

<dl>
<dt><a href="#PathTemplate">PathTemplate</a> : <code>string</code></dt>
<dd><p>A string path. Supports templating in &quot;{variable}&quot; format. IE: &quot;/api/users/{userId}/contacts&quot;</p>
</dd>
<dt><a href="#CallOptions">CallOptions</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#RequestOptions">RequestOptions</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#RequestResponse">RequestResponse</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="Request"></a>

## Request
Simple static class to make external request using http and http node core packages

**Kind**: global class

* [Request](#Request)
    * [.defaultHeaders](#Request.defaultHeaders)
    * [.httpMethod](#Request.defaultHeaders)
    * [.endpoint](#Request.endpoint)
    * [.headers](#Request.headers)
    * [.body](#Request.body)
    * [.statusCode](#Request.statusCode)
    * [.responseBody](#Request.responseBody)
    * [.responseHeaders](#Request.responseHeaders)
    * [.get(endpoint, [options])](#Request.get) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
    * [.post(endpoint, body, [options])](#Request.post) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
    * [.put(endpoint, body, [options])](#Request.put) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
    * [.patch(endpoint, body, [options])](#Request.patch) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
    * [.delete(endpoint, [options])](#Request.delete) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
    * [.call(options)](#Request.call) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)

<a name="Request.defaultHeaders"></a>

### Request.defaultHeaders
<details>
    <summary>To get default request headers</summary>

**Kind**: static property of [<code>Request</code>](#Request)
**Read only**: true
<a name="Request.get"></a>
</details>

### Request.httpMethod
<details>
    <summary>To get request http method</summary>

**Kind**: static property of [<code>Request</code>](#Request)
**Read only**: true
<a name="Request.get"></a>
</details>

### Request.endpoint
<details>
    <summary>To get request endpoint</summary>

**Kind**: static property of [<code>Request</code>](#Request)
**Read only**: true
<a name="Request.get"></a>
</details>

### Request.headers
<details>
    <summary>To get request headers</summary>

**Kind**: static property of [<code>Request</code>](#Request)
**Read only**: true
<a name="Request.get"></a>
</details>

### Request.body
<details>
    <summary>To get request body if exist</summary>

**Kind**: static property of [<code>Request</code>](#Request)
**Read only**: true
<a name="Request.get"></a>
</details>

### Request.statusCode
<details>
    <summary>To get response status code</summary>

**Kind**: static property of [<code>Request</code>](#Request)
**Read only**: true
<a name="Request.get"></a>
</details>

### Request.responseBody
<details>
    <summary>To get response body</summary>

**Kind**: static property of [<code>Request</code>](#Request)
**Read only**: true
<a name="Request.get"></a>
</details>

### Request.responseHeaders
<details>
    <summary>To get response headers</summary>

**Kind**: static property of [<code>Request</code>](#Request)
**Read only**: true
<a name="Request.get"></a>
</details>

### Request.get(endpoint, [options]) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
<details>
    <summary>To make a GET request</summary>

**Kind**: static method of [<code>Request</code>](#Request)

| Param | Type | Default |
| --- | --- | --- |
| endpoint | <code>string</code> |  |
| [options] | [<code>RequestOptions</code>](#RequestOptions) | <code>{}</code> |

<a name="Request.post"></a>
</details>

### Request.post(endpoint, body, [options]) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
<details>
    <summary>To make a POST request</summary>

**Kind**: static method of [<code>Request</code>](#Request)

| Param | Type | Default |
| --- | --- | --- |
| endpoint | <code>string</code> |  |
| body | <code>any</code> |  |
| [options] | [<code>RequestOptions</code>](#RequestOptions) | <code>{}</code> |

<a name="Request.post"></a>
</details>

### Request.put(endpoint, body, [options]) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
<details>
    <summary>To make a PUT request</summary>

**Kind**: static method of [<code>Request</code>](#Request)

| Param | Type | Default |
| --- | --- | --- |
| endpoint | <code>string</code> |  |
| body | <code>any</code> |  |
| [options] | [<code>RequestOptions</code>](#RequestOptions) | <code>{}</code> |

<a name="Request.put"></a>
</details>

### Request.patch(endpoint, body, [options]) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
<details>
    <summary>To make a PATCH request</summary>

**Kind**: static method of [<code>Request</code>](#Request)

| Param | Type | Default |
| --- | --- | --- |
| endpoint | <code>string</code> |  |
| body | <code>any</code> |  |
| [options] | [<code>RequestOptions</code>](#RequestOptions) | <code>{}</code> |

<a name="Request.patch"></a>
</details>

### Request.delete(endpoint, [options]) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
<details>
    <summary>To make a DELETE request</summary>

**Kind**: static method of [<code>Request</code>](#Request)

| Param | Type | Default |
| --- | --- | --- |
| endpoint | <code>string</code> |  |
| [options] | [<code>RequestOptions</code>](#RequestOptions) | <code>{}</code> |

<a name="Request.delete"></a>
</details>

### Request.call(options) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
<details>
    <summary>To make a custom request</summary>

**Kind**: static method of [<code>Request</code>](#Request)

| Param | Type |
| --- | --- |
| options | [<code>CallOptions</code>](#CallOptions) |

<a name="Request.call"></a>
</details>

## PathTemplate : <code>string</code>
A string path. Supports templating in "{variable}" format. IE: "/api/users/{userId}/contacts"

**Kind**: global typedef
<a name="CallOptions"></a>

## CallOptions : <code>object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| headers | <code>object</code> | Custom headers on request. Define as { [headerName]: headerValue } |
| pathParams | <code>object</code> | Replace variables in path declared as "{variable}". Define structure as { [variableNameInPath]: valueForReplace } |
| queryParams | <code>object</code> | Query parameters / filters on request. Define structure as { [queryVariableName]: value } |
| path | [<code>PathTemplate</code>](#PathTemplate) | The request path |
| strictMode | <code>boolean</code> | When this flag is set as true, the request response content-type should be application/json or error will thrown |
| endpoint | <code>string</code> | The request endpoint. Protocol and path are optionals. When no protocol specified, http goes by default. Supports *PathTemplate |
| method | <code>string</code> | The request method. 'GET' is set by default |
| body | <code>any</code> | The request body (if request method accepts it). Can be a valid object, Array, string, or any serializable type. |

<a name="RequestOptions"></a>

## RequestOptions : <code>object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| headers | <code>object</code> | Custom headers on request. Define as { [headerName]: headerValue } |
| pathParams | <code>object</code> | Replace variables in path declared as "{variable}". Define structure as { [variableNameInPath]: valueForReplace } |
| queryParams | <code>object</code> | Query parameters / filters on request. Define structure as { [queryVariableName]: value } |
| path | [<code>PathTemplate</code>](#PathTemplate) | The request path |
| strictMode | <code>boolean</code> | When this flag is set as true, the request response content-type should be application/json or error will thrown |

<a name="RequestResponse"></a>

## RequestResponse : <code>object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| complete | <code>boolean</code> | Flag that represents that if operation was completed |
| aborted | <code>boolean</code> | Flag that represents that if operation was aborted |
| httpVersion | <code>string</code> | String with http protocol version of the response sent |
| rawHeaders | <code>Array.&lt;String&gt;</code> | Request headers as array of srings |
| headers | <code>object</code> | Response headers. Formatted as { [headerName]: headerValue } |
| statusCode | <code>number</code> | Response status code |
| statusMessage | <code>string</code> | Response status message |
| body | <code>any</code> | Response body. Can be a valid object, Array, string, or any serializable type. |
| rawBody | <code>Array</code> | Response body without serialization. |
| originRequest | [<code>CallOptions</code>](#CallOptions) | Used to make another request based on the origin request. Ie: For retry the same request |

---
## :running: Migration
### Migration from v1.x to v2

Now `Request`, in addition to being required in another way, throws an error if the response status code if >= 400

If you want to keep the functionality of v1.x must require and change `RequestSafe` to your old `Request` as follows