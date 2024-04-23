import os
import sys
from bs4 import BeautifulSoup

from urllib.parse import urljoin
import time
import re
import json
import pdb
import utils

from PyQt6.QtWidgets import QApplication, QMainWindow, QDialog, QMessageBox, QGraphicsView, QGraphicsScene, QGraphicsPixmapItem, QFileDialog
from PyQt6.QtCore import QTimer, QPropertyAnimation, QPointF, QObject
from PyQt6.QtCore import Qt,  pyqtSignal, QObject, QThread
from PyQt6 import uic
from PyQt6.QtGui import QPixmap

from scrapaction import ScrapWorker

Ui_MainWindow, _ = uic.loadUiType("mainwindow.ui")

class MyMainWindow(QMainWindow, Ui_MainWindow):

    scrap_start_signal = pyqtSignal()
    scrap_finish_signal = pyqtSignal()
    scrap_error_signal = pyqtSignal()
    scrap_step_signal = pyqtSignal(str)

    def __init__(self):
        super().__init__()
        self.setupUi(self)

        # Connect signals and slots
        # self.btnReadCard.clicked.connect(self.on_btn_readcard)

        pixmap = QPixmap("scraploading.png")
        scene = QGraphicsScene()
        # Create a QGraphicsPixmapItem with the loaded image
        pixmap_item = scene.addPixmap(pixmap)

        # Add the pixmap item to the scene
        scene.addItem(pixmap_item)

        # Set the rotation center
        pixmap_item.setTransformOriginPoint(
            pixmap_item.boundingRect().center()
        )

        self.imgLoading.setScene(scene)
        # Create the animation
        # self.imgLoading.animation = QPropertyAnimation((QObject)pixmap_item, b"rotation")
        # self.imgLoading.animation.setStartValue(0)
        # self.imgLoading.animation.setEndValue(360)
        # self.imgLoading.animation.setDuration(2000)
        # self.imgLoading.animation.setLoopCount(-1)  # Infinite loop
        # Set the scene on the view

        #======================================================================
        self.frmLoading.hide()
        self.btnStart.clicked.connect(self.on_btn_start)
        self.btnStop.clicked.connect(self.on_btn_stop)
        self.btnFileDlg.clicked.connect(self.on_btn_filedlg)

        
        self.scrap_start_signal.connect(self.on_scrap_start)
        self.scrap_finish_signal.connect(self.on_scrap_finish)
        self.scrap_error_signal.connect(self.on_scrap_error)
        self.scrap_step_signal.connect(self.on_scrap_step)

        self.lnTargetURL.setText('https://app.mindsmith.ai/learn/clv2w0j8j0019jv0afec1u0d8')
        # self.lnTargetURL.setText('https://app.mindsmith.ai/learn/clumzudxw0056jt085xb7jcai')
        # Connect Signals and Slots
        # self.scrap_thread = QThread()
        # self.scrap_worker = ScrapWorker('', '', True,  self.scrap_start_signal, self.scrap_finish_signal, self.scrap_error_signal, self.scrap_step_signal)
        # self.scrap_worker.moveToThread(self.scrap_thread)

        # self.scrap_thread.started.connect(self.scrap_worker.do_work)
        # self.scrap_thread.finished.connect(self.scrap_thread.deleteLater)

        


        

    def on_btn_start(self):
        
        target_url = self.lnTargetURL.text()
        dest_dir = self.lnDestFolder.text()
        if len(target_url) == 0 or len(dest_dir) == 0:
            QMessageBox.information(None, "Alert", "Please input scrap info")
            return
        
        

        
        

        self.scrap_thread = QThread()
        self.scrap_worker = ScrapWorker('', '', True,  self.scrap_start_signal, self.scrap_finish_signal, self.scrap_error_signal, self.scrap_step_signal)
        self.scrap_worker.moveToThread(self.scrap_thread)
        self.scrap_worker.set_url(target_url)
        self.scrap_worker.set_dest_dir(dest_dir)
        self.scrap_worker.set_show_brower(True)

        self.scrap_thread.started.connect(self.scrap_worker.do_work)
        self.scrap_thread.finished.connect(self.scrap_thread.deleteLater)
        self.scrap_thread.start()

        self.txtProcess.setText('')

        self.btnStop.hide()
        self.btnStop.setText('Finish')
        self.frmLoading.show()
        
    def on_btn_stop(self):
        self.frmLoading.hide()
        # self.scrap_thread.finis
    def on_btn_filedlg(self):
        folder_path = QFileDialog.getExistingDirectory(self, 'Select Folder')

        if folder_path:
            self.lnDestFolder.setText(folder_path)
            print('Selected folder:', folder_path)

    def on_scrap_start(self):
        print('Scrap Started')
        self.txtProcess.setText('Scrap Started')
    def on_scrap_finish(self):
        print('Scrap Finisehd')
        self.txtProcess.setText('Scrap Finished')
        self.btnStop.setText('Close')
        self.btnStop.show()
        # self.scrap_thread.quit()
        self.scrap_thread.quit()
        self.scrap_thread.wait()
    def on_scrap_error(self):
        print('Scrap Error')
        self.txtProcess.setText('Scrap Error')
    def on_scrap_step(self, step):
        print('Scrap Step')
        self.txtProcess.setText(step)

def main ():
    app = QApplication(sys.argv)
    window = MyMainWindow()
    window.show()
    sys.exit(app.exec())
main()

