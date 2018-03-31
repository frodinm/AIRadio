package com.airadiomobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
<<<<<<< HEAD
import com.horcrux.svg.SvgPackage;
=======
import com.oblador.vectoricons.VectorIconsPackage;
>>>>>>> 6bae76ea7940b9f01f56ef8c13e84d4a0279d3fe
import org.reactnative.camera.RNCameraPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
<<<<<<< HEAD
            new SvgPackage(),
=======
            new VectorIconsPackage(),
>>>>>>> 6bae76ea7940b9f01f56ef8c13e84d4a0279d3fe
            new RNCameraPackage(),
            new RNFetchBlobPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
