import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

import utils

def check_do(driver, slide_no, dest_dir):

    print('###### Scrap Static ######')
    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")
    img_elements = slide_container.find_elements(By.TAG_NAME, "img")

    # Check Slide Type is Matching
    if len(img_elements) == 0:
        return False, ''

    scorm_slide = {'type': 'image', 'data': { 'src':'', 'header':'', 'paragraph': '', 'alightType':''}, 'audio':{} }
    
    
    for img_element in img_elements:
        print(img_element.get_attribute("src"))
        url = img_element.get_attribute("src")

        filename = url.split("/")[-1]
        filename = filename.replace("%", "_").replace("#", "-")
        # filename = utils.gen_file_name(slide_no)

        # Download Image
        src = utils.download_resource(url, dest_dir + '/src', filename)

        header_text = ''
        paragraph_text = ''
        align_type = ''
        # Align Type top-image
        h1_elements = img_element.find_elements(By.XPATH, 'following-sibling::h1')
        paragraph_wrap_elements = img_element.find_elements(By.XPATH, "following-sibling::div[contains(@class, 'MuiTypography-root')]")


        if len(h1_elements) != 0 or len(paragraph_wrap_elements) != 0:
            align_type = 'top-image'
        else:
            img_wrap_element = img_element.find_elements(By.XPATH, '..')[0]
            content_wrap_elements = img_wrap_element.find_elements(By.XPATH, "preceding-sibling::*[1]")
            if len(content_wrap_elements) != 0:
                align_type = 'right-image'
                content_wrap_element = content_wrap_elements[0]
                h1_elements = content_wrap_element.find_elements(By.XPATH, ".//h1 | .//h2")
                paragraph_wrap_elements = content_wrap_element.find_elements(By.XPATH, ".//div[contains(@class, 'MuiTypography-root')]")
            else:
                content_wrap_elements = img_wrap_element.find_elements(By.XPATH, "following-sibling::*[1]")
                if len(content_wrap_elements) != 0:
                    align_type = 'left-image'
                    content_wrap_element = content_wrap_elements[0]
                    h1_elements = content_wrap_element.find_elements(By.XPATH, ".//h1 | .//h2")
                    paragraph_wrap_elements = content_wrap_element.find_elements(By.XPATH, ".//div[contains(@class, 'MuiTypography-root')]")
                else:
                    img_wrap_wrap_element = img_wrap_element.find_elements(By.XPATH, '..')[0]
                    content_wrap_elements = img_wrap_wrap_element.find_elements(By.XPATH, "preceding-sibling::*[1]")
                    if len(content_wrap_elements) != 0:
                        align_type = 'strech-right-image'
                        content_wrap_element = content_wrap_elements[0]
                        h1_elements = content_wrap_element.find_elements(By.XPATH, ".//h1 | .//h2")
                        paragraph_wrap_elements = content_wrap_element.find_elements(By.XPATH, ".//div[contains(@class, 'MuiTypography-root')]")
                    else:
                        content_wrap_elements = img_wrap_wrap_element.find_elements(By.XPATH, "following-sibling::*[1]")
                        if len(content_wrap_elements) != 0:
                            align_type = 'stretch-left-image'
                            content_wrap_element = content_wrap_elements[0]
                            h1_elements = content_wrap_element.find_elements(By.XPATH, ".//h1 | .//h2")
                            paragraph_wrap_elements = content_wrap_element.find_elements(By.XPATH, ".//div[contains(@class, 'MuiTypography-root')]")

        if len(h1_elements) != 0:
            h1_element = h1_elements[0]
            header_text = h1_element.get_attribute('innerHTML')
        if len(paragraph_wrap_elements) != 0:
            paragraph_wrap_element = paragraph_wrap_elements[0]
            paragraph_content_elements = paragraph_wrap_element.find_elements(By.XPATH, ".//div[@data-contents]")
            if len(paragraph_content_elements) != 0:
                paragraph_text = paragraph_content_elements[0].get_attribute('innerHTML')
        
        scorm_slide['data'] = {'src':src, 'header':header_text, 'paragraph': paragraph_text, 'alightType': align_type}

        scorm_slide['audio'] = utils.get_audio(driver, slide_no, dest_dir)

        # print(scorm_slide)
        # print(tag)
        # print(exp)

    return True, scorm_slide
    # print(str(scorm_obj))

