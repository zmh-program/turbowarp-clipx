package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
)

func translate(text string, source string, target string) (string, error) {
	path := fmt.Sprintf("%s?%s", "https://api.mymemory.translated.net/get", url.Values{
		"q":        {text},
		"langpair": {fmt.Sprintf("%s|%s", source, target)},
	}.Encode())

	client := &http.Client{}
	req, err := http.NewRequest("GET", path, nil)
	if err != nil {
		return "", errors.New("client creation failed")
	}
	resp, err := client.Do(req)
	if err != nil {
		return "", errors.New("request failed")
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			return
		}
	}(resp.Body)

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", errors.New("read response body failed")
	}

	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return "", errors.New("unmarshal response body failed")
	}
	result := data["responseData"].(map[string]interface{})["translatedText"]

	return result.(string), nil
}

func main() {

	translation, err := translate("Hello World!", "en", "zh-cn")
	if err != nil {
		log.Fatalf("Translation error: %v", err)
	}

	fmt.Printf("Translation: %s\n", translation)
}
