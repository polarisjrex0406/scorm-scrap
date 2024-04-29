import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def check_do(driver, slide_no, dest_dir):

    print('###### Scrap Section Divider ######')

    ret_obj = []
    menu_b_div = driver.find_elements(By.CSS_SELECTOR, ".pointer-events-none")[1]
    menu_div = menu_b_div.find_element(By.XPATH, "following-sibling::*[1]")
    menu_button = menu_div.find_element(By.XPATH, ".//button")
    print(menu_button.get_attribute('innerHTML'))
    menu_button.click()
    time.sleep(3)

    menu_dialog = driver.find_element(By.CSS_SELECTOR, ".MuiDialog-paper")
    menu_items = menu_dialog.find_elements(By.XPATH, ".//button")
    close_btn = menu_items[0]
    for menu_item in menu_items:
        ret_obj.append({
            'text': menu_item.text,
            'slide_no': -1
        })
    
    close_btn.click()
    ret_obj = ret_obj[1:-1]
    return True, ret_obj
    # print(str(scorm_obj))

