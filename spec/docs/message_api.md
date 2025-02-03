# メッセージ API

## GET /v1/user/me/message-room

### 内容

* メッセージルーム情報リスト取得

### Request

#### Content-Type
```
application/json; charset=UTF-8
```

#### URL パラメータ

なし

#### クエリパラメータ

|key|type|value|must|備考|
|---|----|-----|----|----|
|sort|string|ソート順を設定|✗||
|limit|number|最大取得数|✗||
|offset|number|オフセット値|✗||
|includeCloseRoom|number|1で非表示のルームも含める|✗|デフォルトは含めない|
|newPostOnly|number|1で未読ポストがあるもののみ取得|✗|デフォルトは含めない|

##### 例
```
?sort=-id&limit=100&offset=50&includeCloseRoom=1&newPostOnly=1
```

#### ボディ

なし

### Response

#### 成功時

##### HTTP status

200

##### Response Type

|key|type|value|must|備考|
|---|----|-----|----|----|
|messageRooms|MessageRoom[]|メッセージルームリスト|◯|空配列[]の可能性あり|
|total|number|総メッセージルームリスト数|◯||

###### Type MessageRoom

|key|type|value|must|備考|
|---|----|-----|----|----|
|id|string|ID|◯||
|isOwner|booleanm|自分がオーナーのメッセージルームか否か|◯||
|ownerUserId|string|オーナーユーザーID|◯||
|ownerUserType|enum['user', 'recruitCompanyUser']|オーナーユーザー種別|◯||
|ownerUserName|string|オーナーユーザーネーム|◯||
|ownerRecruitCompanyId|string|求人企業ID|✗|オーナーユーザーが求人企業ユーザーの場合のみ|
|ownerRecruitCompanyName|string|求人企業名|✗|オーナーユーザーが求人企業ユーザーの場合のみ|
|invitedUserId|string|招待ユーザーID|◯||
|invitedUserType|enum['user', 'recruitCompanyUser']|招待ユーザー種別|◯||
|invitedUserName|string|招待ユーザーネーム|◯||
|invitedRecruitCompanyId|string|求人企業ID|✗|招待ユーザーが求人企業ユーザーの場合のみ|
|invitedRecruitCompanyName|string|求人企業名|✗|招待ユーザーが求人企業ユーザーの場合のみ|
|isClose|boolean|非表示扱いか否か|◯||
|isNewPost|boolean|未読のポストがあるか否か|◯||
|latestPostUnixTime|string|最後のポスト投稿日時(unix time)|◯||

##### 例
```
{
  "messageRooms": [
    {
      "id": "room000001",
      "isOwner": true,
      "ownerUserId": "123",
      "ownerUserType": "user",
      "ownerUserName": "一般ユーザー",
      "invitedUserId": "456",
      "invitedUserType": "recruitCompanyUser",
      "invitedUserName": "求人企業ユーザーABC",
      "invitedRecruitCompanyId": "companyABC",
      "invitedRecruitCompanyName": "株式会社ABC",
      "isClose": false,
      "isNewPost": true,
      "latestPostUnixTime": "1234567890"
    },
    {
      "id": "room000001",
      "isOwner": true,
      "ownerUserId": "789",
      "ownerUserType": "recruitCompanyUser",
      "ownerUserName": "求人企業ユーザーXYZ",
      "ownerRecruitCompanyId": "companyXYZ",
      "ownerRecruitCompanyName": "株式会社XYZ",
      "invitedUserId": "123",
      "invitedUserType": "user",
      "invitedUserName": "一般ユーザー",
      "isClose": false,
      "isNewPost": true,
      "latestPostUnixTime": "1234567890"
    }
  ],
  "total": 2
}
```

#### 失敗時

|HTTP status|失敗内容|備考|
|-----------|--------|----|
|401|アクセストークン期限切れ||

------

## GET /v1/user/me/message-room/{messageRoomId}

### 内容

* メッセージルーム情報取得

### Request

#### Content-Type
```
application/json; charset=UTF-8
```

#### URL パラメータ

|key|type|value|must|備考|
|---|----|-----|----|----|
|messageRoomId|string|メッセージルームID|◯||

##### 例
```
/v1/user/me/message-room/room000001
```

#### クエリパラメータ

なし

#### ボディ

なし

### Response

#### 成功時

##### HTTP status

200

##### Response Type

|key|type|value|must|備考|
|---|----|-----|----|----|
|id|string|ID|◯||
|isOwner|booleanm|自分がオーナーのメッセージルームか否か|◯||
|ownerUserId|string|オーナーユーザーID|◯||
|ownerUserType|enum['user', 'recruitCompanyUser']|オーナーユーザー種別|◯||
|ownerUserName|string|オーナーユーザーネーム|◯||
|ownerRecruitCompanyId|string|求人企業ID|✗|オーナーユーザーが求人企業ユーザーの場合のみ|
|ownerRecruitCompanyName|string|求人企業名|✗|オーナーユーザーが求人企業ユーザーの場合のみ|
|invitedUserId|string|招待ユーザーID|◯||
|invitedUserType|enum['user', 'recruitCompanyUser']|招待ユーザー種別|◯||
|invitedUserName|string|招待ユーザーネーム|◯||
|invitedRecruitCompanyId|string|求人企業ID|✗|招待ユーザーが求人企業ユーザーの場合のみ|
|invitedRecruitCompanyName|string|求人企業名|✗|招待ユーザーが求人企業ユーザーの場合のみ|
|isClose|boolean|非表示扱いか否か|◯||
|isNewPost|boolean|未読のポストがあるか否か|◯||
|latestPostUnixTime|string|最後のポスト投稿日時(unix time)|◯||

##### 例
```
{
  "id": "room000001",
  "isOwner": true,
  "ownerUserId": "123",
  "ownerUserType": "user",
  "ownerUserName": "一般ユーザー",
  "invitedUserId": "456",
  "invitedUserType": "recruitCompanyUser",
  "invitedUserName": "求人企業ユーザーABC",
  "invitedRecruitCompanyId": "companyABC",
  "invitedRecruitCompanyName": "株式会社ABC",
  "isClose": false,
  "isNewPost": true,
  "latestPostUnixTime": "1234567890"
}
```

#### 失敗時

|HTTP status|失敗内容|備考|
|-----------|--------|----|
|401|アクセストークン期限切れ||
|403|自分は参加していなメッセージルームが指定された||
|404|存在しないメッセージルーム||

-----

## DELETE /v1/user/me/message-room/{messageRoomId}

### 内容

* メッセージルームを非表示にする

### Request

#### Content-Type
```
application/json; charset=UTF-8
```

#### URL パラメータ

|key|type|value|must|備考|
|---|----|-----|----|----|
|messageRoomId|string|メッセージルームID|◯||

##### 例
```
/v1/user/me/message-room/room000001
```

#### クエリパラメータ

なし

#### ボディ

なし

### Response

#### 成功時

##### HTTP status

204

#### 失敗時

|HTTP status|失敗内容|備考|
|-----------|--------|----|
|401|アクセストークン期限切れ||
|403|自分は参加していなメッセージルームが指定された||
|404|存在しないメッセージルーム||

-----

## GET /v1/user/me/message-room/{messageRoomId}/post

### 内容

* メッセージルームポスト取得

### Request

#### Content-Type
```
application/json; charset=UTF-8
```

#### URL パラメータ

|key|type|value|must|備考|
|---|----|-----|----|----|
|messageRoomId|string|メッセージルームID|◯||

##### 例
```
/v1/user/me/message-room/room000001/post
```

#### クエリパラメータ

|key|type|value|must|備考|
|---|----|-----|----|----|
|sort|string|ソート順を設定|✗||
|limit|number|最大取得数|✗||
|offset|number|オフセット値|✗||

##### 例
```
?sort=-id&limit=100&offset=50
```

#### ボディ

なし

### Response

#### 成功時

##### HTTP status

200

##### Response Type

|key|type|value|must|備考|
|---|----|-----|----|----|
|posts|MessageRoomPost[]|メッセージルームポストリスト|◯|空配列の場合あり|
|total|mnumber|総メッセージルームポスト数|◯||

###### Type MessageRoomPost

|key|type|value|must|備考|
|---|----|-----|----|----|
|id|string|メッセージルームポストID|◯||
|postUserId|string|ポストしたユーザーID|◯||
|postUserName|string|ポストしたユーザーネーム|◯||
|postUnixTime|string|ポストした日時(unix time)|◯||
|postBody|string|ポスト内容|◯||

##### 例
```
{
    posts: [
        {
            "id": "post000001",
            "postUserId": "123",
            "postUserName": "一般ユーザー",
            "postUnixTime": "1234567890",
            "postBody": "本文"
        },
        {
            "id": "post000002",
            "postUserId": "456",
            "postUserName": "求人企業ユーザー",
            "postUnixTime": "1234567891",
            "postBody": "返答文"
        }
    ],
    total: 2
}
```

#### 失敗時

|HTTP status|失敗内容|備考|
|-----------|--------|----|
|401|アクセストークン期限切れ||
|403|自分は参加していなメッセージルームが指定された||
|404|存在しないメッセージルーム||

-----

## POST /v1/user/me/message-room/{messageRoomId}/post

### 内容

* メッセージルームにポストを送信する

### Request

#### Content-Type
```
application/json; charset=UTF-8
```

#### URL パラメータ

|key|type|value|must|備考|
|---|----|-----|----|----|
|messageRoomId|string|メッセージルームID|◯||

##### 例
```
/v1/user/me/message-room/room000001/post
```

#### クエリパラメータ

なし

#### ボディ

|key|type|value|must|備考|
|---|----|-----|----|----|
|postBody|string|ポスト内容|◯|||

#### 例
```
{
    postBody: "ポストする内容"
}
```

### Response

#### 成功時

##### HTTP status

204

#### 失敗時

|HTTP status|失敗内容|備考|
|-----------|--------|----|
|400|内容に不備がある||
|401|アクセストークン期限切れ||
|403|自分は参加していなメッセージルームが指定された||
|404|存在しないメッセージルーム||

-----

## POST /v1//user/me/apply-job/{wantedAdsId}

### 内容

* 求人広告に応募する

### Request

#### Content-Type
```
application/json; charset=UTF-8
```

#### URL パラメータ

|key|type|value|must|備考|
|---|----|-----|----|----|
|wantedAdsId|string|求人広告ID|◯||

##### 例
```
/v1/user/me/apply-job/ads000001
```

#### クエリパラメータ

なし

#### ボディ

なし

### Response

#### 成功時

##### HTTP status

204

#### 失敗時

|HTTP status|失敗内容|備考|
|-----------|--------|----|
|401|アクセストークン期限切れ||
|404|存在しない求人広告||

-----
