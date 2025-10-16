# Create a Zoom Team Chat Chatbot app with the App Manifest API

This guide shows how to create a Zoom Team Chatbot app using the **App Manifest API**.

* First, add the following marketplace scopes:
  * Create apps: marketplace:write:app
  * View an app: marketplace:read:app

* Use the [Update an app by manifest](https://developers.zoom.us/docs/api/marketplace/#tag/manifest/put/marketplace/apps/{appId}/manifest) endpoint to quickly configure a Zoom Marketplace app.
  
* Replace `example.ngrok.app` with your actual ngrok domain when testing locally.

### Endpoint

```http
PUT /marketplace/apps/{appId}/manifest
```

### Sample request payload

```json
{
  "manifest": {
    "display_information": {
      "display_name": "Zoom Contact Center Apps JS Sample"
    },
    "oauth_information": {
      "usage": "USER_OPERATION",
      "development_redirect_uri": "https://example.ngrok.app/auth/callback",
      "production_redirect_uri": "",
      "oauth_allow_list": [
        "https://oauth.pstmn.io/v1/callback",
        "https://example.ngrok.app/auth/callback"
      ],
      "strict_mode": false,
      "subdomain_strict_mode": false,
      "scopes": [
        { "scope": "marketplace:read:app", "optional": false },
        { "scope": "meeting:read:meeting", "optional": false },
        { "scope": "team_chat:read:user_message", "optional": false },
        { "scope": "zoomapp:inmeeting", "optional": false }
      ]
    },
    "features": {
      "products": [
        "ZOOM_CONTACT_CENTER",
        "ZOOM_MEETING"
      ],
      "development_home_uri": "https://example.ngrok.app",
      "production_home_uri": "",
      "domain_allow_list": [
        { "domain": "appssdk.zoom.us", "explanation": "" },
        { "domain": "ngrok.app", "explanation": "" },
        { "domain": "cdn.ngrok.com", "explanation": "" },
        { "domain": "cdn.jsdelivr.net", "explanation": "" }
      ],
      "in_client_feature": {
        "zoom_app_api": {
          "enable": true,
          "zoom_app_apis": [
            "getAppContext",
            "getAppVariableList",
            "getEngagementContext",
            "getEngagementStatus",
            "getEngagementVariableValue",
            "getMeetingContext",
            "getMeetingUUID",
            "getRunningContext",
            "getSupportedJsApis",
            "getUserContext",
            "onEngagementContextChange",
            "onEngagementMediaRedirect",
            "onEngagementStatusChange",
            "onEngagementVariableValueChange"
          ]
        },
        "guest_mode": {
          "enable": false,
          "enable_test_guest_mode": false
        },
        "in_client_oauth": {
          "enable": false
        },
        "collaborate_mode": {
          "enable": false,
          "enable_screen_sharing": false,
          "enable_play_together": false,
          "enable_start_immediately": false,
          "enable_join_immediately": false
        }
      },
      "zoom_client_support": {
        "mobile": { "enable": false },
        "zoom_room": {
          "enable": false,
          "enable_personal_zoom_room": false,
          "enable_shared_zoom_room": false,
          "enable_digital_signage": false,
          "enable_zoom_rooms_controller": false
        },
        "pwa_client": { "enable": false }
      },
      "embed": {
        "meeting_sdk": {
          "enable": false,
          "enable_device": false,
          "devices": []
        },
        "contact_center_sdk": { "enable": true },
        "phone_sdk": { "enable": false }
      },
      "team_chat_subscription": {
        "enable": false,
        "enable_support_channel": false,
        "shortcuts": []
      },
      "event_subscription": {
        "enable": false,
        "events": []
      }
    }
  }
}
```
