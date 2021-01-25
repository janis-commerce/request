# Request Module

![Build Status](https://github.com/janis-commerce/request/workflows/Build%20Status/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/request/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/request?branch=master)
[![npm version](https://badge.fury.io/js/%40janiscommerce%2Frequest.svg)](https://www.npmjs.com/package/@janiscommerce/request)

## 📦 Require
```js
const Request = require('@janiscommerce/request');
```

### Get Request Example
```js
const { body } = await Request.get('https://reqres.in/api/users')
console.log(body)
```

### Post Request Example
```js
const { body: { id } } = await Request.post(
    'https://reqres.in/api/users',
    {
        name: 'morpheus',
        job: 'leader'
    }
)
console.log(id)
```

---

## ⚙️ Classes

<dl>
<dt><a href="#Request">Request</a></dt>
<dd><p>Simple static class to make external request using http and http node core packages</p>
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
    * [.get(endpoint, [options])](#Request.get) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
    * [.post(endpoint, body, [options])](#Request.post) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
    * [.put(endpoint, body, [options])](#Request.put) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
    * [.patch(endpoint, body, [options])](#Request.patch) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
    * [.delete(endpoint, [options])](#Request.delete) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
    * [.call(options)](#Request.call) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)

<a name="Request.defaultHeaders"></a>

### Request.defaultHeaders
To get default request headers

**Kind**: static property of [<code>Request</code>](#Request)
**Read only**: true
<a name="Request.get"></a>

### Request.get(endpoint, [options]) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
To make a GET request

**Kind**: static method of [<code>Request</code>](#Request)

| Param | Type | Default |
| --- | --- | --- |
| endpoint | <code>string</code> |  |
| [options] | [<code>RequestOptions</code>](#RequestOptions) | <code>{}</code> |

<a name="Request.post"></a>

### Request.post(endpoint, body, [options]) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
To make a POST request

**Kind**: static method of [<code>Request</code>](#Request)

| Param | Type | Default |
| --- | --- | --- |
| endpoint | <code>string</code> |  |
| body | <code>any</code> |  |
| [options] | [<code>RequestOptions</code>](#RequestOptions) | <code>{}</code> |

<a name="Request.put"></a>

### Request.put(endpoint, body, [options]) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
To make a PUT request

**Kind**: static method of [<code>Request</code>](#Request)

| Param | Type | Default |
| --- | --- | --- |
| endpoint | <code>string</code> |  |
| body | <code>any</code> |  |
| [options] | [<code>RequestOptions</code>](#RequestOptions) | <code>{}</code> |

<a name="Request.patch"></a>

### Request.patch(endpoint, body, [options]) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
To make a PATCH request

**Kind**: static method of [<code>Request</code>](#Request)

| Param | Type | Default |
| --- | --- | --- |
| endpoint | <code>string</code> |  |
| body | <code>any</code> |  |
| [options] | [<code>RequestOptions</code>](#RequestOptions) | <code>{}</code> |

<a name="Request.delete"></a>

### Request.delete(endpoint, [options]) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
To make a DELETE request

**Kind**: static method of [<code>Request</code>](#Request)

| Param | Type | Default |
| --- | --- | --- |
| endpoint | <code>string</code> |  |
| [options] | [<code>RequestOptions</code>](#RequestOptions) | <code>{}</code> |

<a name="Request.call"></a>

### Request.call(options) ⇒ [<code>Promise.&lt;RequestResponse&gt;</code>](#RequestResponse)
To make a custom request

**Kind**: static method of [<code>Request</code>](#Request)

| Param | Type |
| --- | --- |
| options | [<code>CallOptions</code>](#CallOptions) |

<a name="PathTemplate"></a>

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

