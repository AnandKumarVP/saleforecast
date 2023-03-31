
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import xgboost as xgb
import os
# from app import upload
# from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
color_pallet = sns.color_palette()
plt.style.use('fivethirtyeight')


# print(periodicity)
# print(duration)

def forecast(duration,freqip):
    print(freqip)
    print(duration)
    df = pd.read_csv('./uploads/actual_data.csv')
  
    
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df["date"] = pd.to_datetime(df["date"], format="%m-%d-%Y")
    df["date"] = df["date"].dt.strftime("%Y-%m-%d")
    df.head(5)
    df = df.groupby('date').sum('sales')
    
    df.to_csv('./download/grouped_data.csv')
    
    df.index = pd.to_datetime(df.index)
    # df.plot(
    #         # style='.',
    #         figsize=(15, 5),
    #         color=color_pallet[0],
    #         title='Sales over the period')
    # plt.show()
    
    train, test = train_test_split(df, test_size=0.4, shuffle=False)
    fig, ax = plt.subplots(figsize=(15, 5))
    train.plot(ax=ax, label='Training Set', title='Train/Test Split data')
    test.plot(ax=ax, label='Test Set')
    ax.axvline(train.index[-1], color='Gray', ls='--')
    ax.legend(['Training Set', 'Test Set'])
    # plt.show()
    def create_features(df):
        """
        Creating time series features based on dataframe index.
        """
        df = df.copy()
        df['hour'] = df.index.hour
        df['dayofweek'] = df.index.dayofweek
        df['quarter'] = df.index.quarter
        df['month'] = df.index.month
        df['year'] = df.index.year
        df['dayofyear'] = df.index.dayofyear
        df['dayofmonth'] = df.index.day
        df['weekofyear'] = df.index.isocalendar().week
        return df
    train = create_features(train)
    test = create_features(test)
    FEATURES = ['dayofyear', 'dayofweek', 'quarter', 'month', 'year']
    TARGET = 'sales'
    X_train = train[FEATURES]
    y_train = train[TARGET]
    X_test = test[FEATURES]
    y_test = test[TARGET]
    reg = xgb.XGBRegressor(base_score=0.5, booster='gbtree',    
                            n_estimators=1000,
                            early_stopping_rounds=50,
                            objective='reg:linear',
                            max_depth=3,
                            learning_rate=0.01)
    reg.fit(X_train, y_train,
                eval_set=[(X_train, y_train), (X_test, y_test)],
                verbose=100)
    fi = pd.DataFrame(data=reg.feature_importances_,
                    index=reg.get_booster().feature_names,
                    columns=['importance'])
    fi.sort_values('importance').plot(kind='barh', title='Feature Importance')
    # plt.show()

    test['prediction_xg'] = reg.predict(X_test)
    df = df.merge(test[['prediction_xg']], how='left', left_index=True, right_index=True)
    ax = df[['sales']].plot(figsize=(15, 5))
    df['prediction_xg'].plot(ax=ax, style='.')
    plt.legend(['Truth Data', 'Predictions'])
    ax.set_title('Raw Data and Prediction')
    # plt.show()

    ax = df.loc[(df.index > '08-08-2010') & (df.index < '11-08-2017')]['sales'] \
            .plot(figsize=(15, 5), title='Week Of Data')
    df.loc[(df.index > '08-08-2010') & (df.index < '11-08-2017')]['prediction_xg'] \
            .plot()
    plt.legend(['Truth Data','Prediction'])
    # plt.show()
        # score = np.sqrt(mean_squared_error(test['sales'], test['prediction']))
        # print(f'RMSE Score on Test set: {score:0.2f}')
    xg_rmse = np.sqrt(mean_squared_error(test['sales'], test['prediction_xg']))
    xg_mae = mean_absolute_error(test['sales'], test['prediction_xg'])
    xg_r2 = r2_score(test['sales'], test['prediction_xg'])
    print('Random Forest RMSE: ', xg_rmse)
    print('Random Forest R2 Score: ', xg_r2)
    
    #future dates
    start_date = df.index[0]
    print(start_date)
    last_date = df.index[-1]
    print(last_date)
    future_dates = pd.date_range(start=last_date, periods=int(duration), freq=freqip)
    print(future_dates[-1])
    
    to_predict = pd.DataFrame(pd.date_range(start=last_date, end=future_dates[-1]), columns=['date'])
    to_predict.index = pd.to_datetime(to_predict.date)
    to_predict_feature = create_features(to_predict)
    to_predict_feature = to_predict_feature[FEATURES]
    to_predict_feature['prediction'] = reg.predict(to_predict_feature)
    ax = df[['sales']].plot(figsize=(15, 5))
    df['prediction_xg'].plot(ax=ax, style='.')
    to_predict_feature['prediction'].plot(ax=ax)
    plt.legend(['Truth Data', 'Predictions'])
    ax.set_title('Raw Data and Prediction')
#     plt.show()
    folder_path = "D:/Entertainment/New folder/Kaar Tech/project/Angular/saleforecast/src/assets/"
#     Create the folder if it doesn't existaas
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    # Save the plot in the specified folder as a PNG image
    filename = "my_plot.png"
    filepath = os.path.join(folder_path, filename)
    plt.savefig(filepath)

    # Save predictions to CSV   
    to_predict = pd.DataFrame(pd.date_range(start=last_date, end=future_dates[-1]), columns=['date'])
    to_predict.index = pd.to_datetime(to_predict.date)
    to_predict_feature = create_features(to_predict)
    to_predict_feature = to_predict_feature[FEATURES]
    to_predict_feature['prediction'] = reg.predict(to_predict_feature)
#     ax = df[['sales']].plot(figsize=(15, 5))
#     df['prediction_xg'].plot(ax=ax, style='.')
    to_predict_feature['prediction'].plot(ax=ax)
#     plt.legend(['Truth Data', 'Predictions'])
    ax.set_title('Raw Data and Prediction')
    
    to_predict_feature.reset_index(inplace=True)
    to_predict_feature.rename(columns={'index':'date'}, inplace=True)
    to_predict_feature[['date', 'prediction']].to_csv('./download/predicted_data.csv', index=False)
    return True
