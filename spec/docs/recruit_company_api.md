# 求人企業ユーザー API

## GET /recruit-company/user/{recruitCompanyId}

### 内容

* 求人企業ユーザーリスト取得

### Request

#### Content-Type
```
application/json; charset=UTF-8
```

#### URL パラメータ

|key|type|value|must|備考|
|---|----|-----|----|----|
|recruitCompanyId|string|取得対象求人企業ID|◯||

##### 例
```
/recruit-company/user/012345789
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
|users|RecruitCompanyUser[]|求人企業ユーザーリスト|◯|空配列[]の可能性あり|
|total|number|求人企業ユーザー数|◯||

###### Type RecruitCompanyUser

|key|type|value|must|備考|
|---|----|-----|----|----|
|userId|string|ユーザーID|◯||
|mailAddress|string|メールアドレス|◯||

##### 例
```
{
    users: [
        {
            userId: "userABC",
            mailAddress: "abc@example.com"
        },
        {
            userId: "userDEF",
            mailAddress: "def@example.com"
        },
        {
            userId: "userGHI",
            mailAddress: "ghi@example.com"
        }
    ],
    total: 3
}
```

#### 失敗時

|HTTP status|失敗内容|備考|
|-----------|--------|----|
|401|アクセストークン期限切れ||
|403|アクセス権限がない||
|404|求人企業が存在しない||


## POST /recruit-company/user

### 内容

* 求人企業ユーザー新規追加

### Request

#### Content-Type
```
application/json; charset=UTF-8
```

#### URL パラメータ

なし

#### クエリパラメータ

なし

#### ボディ

|key|type|value|must|備考|
|---|----|-----|----|----|
|mailAddress|string|新規追加するメールアドレス|◯||
|recruitCompanyId|string|対象となる求人企業ID|◯||

##### 例
```
{
    mailAddress: "abcdefg@example.com",
    recruitCompanyId: "companyA"
}
```

### Response

#### 成功時

##### HTTP status

204

#### 失敗時

|HTTP status|失敗内容|備考|
|-----------|--------|----|
|401|アクセストークン期限切れ||
|403|アクセス権限がない||
|404|ユーザーか求人企業が存在しない||


## DELETE /recruit-company/user

### 内容

* 求人企業ユーザー削除

### Request

#### Content-Type
```
application/json; charset=UTF-8
```

#### URL パラメータ

なし

#### クエリパラメータ

なし

#### ボディ

|key|type|value|must|備考|
|---|----|-----|----|----|
|mailAddress|string|削除するメールアドレス|◯||
|recruitCompanyId|string|対象となる求人企業ID|◯||

##### 例
```
{
    mailAddress: "abcdefg@example.com",
    recruitCompanyId: "companyA"
}
```

### Response

#### 成功時

##### HTTP status

204

#### 失敗時

|HTTP status|失敗内容|備考|
|-----------|--------|----|
|401|アクセストークン期限切れ||
|403|アクセス権限がない||
|404|ユーザーか求人企業が存在しない||
