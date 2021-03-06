import React, { Component, lazy, Suspense } from 'react'
import Select from 'react-select'
import { withTheme } from 'styled-components'
import { compose } from 'recompose'

import 'rc-slider/assets/index.css'

import {
  addAlphaChannel,
  getDataFromDB,
  getDataFromDB2,
  getParams,
} from 'utils'
import { withMatchMedia } from 'hocs'

import { Switch, Slider } from './components'
import { OPTIONS } from './consts'
import {
  Wrapper,
  ChartWrapper,
  TopBar,
  theme,
  colourStyles,
  TableStyles,
  SwitchWrapper,
} from './styles'

const ResponsivePie = lazy(() => import('components/Charts/Pie'))
const ResponsiveLine = lazy(() => import('components/Charts/Line'))
const ResponsiveBar = lazy(() => import('components/Charts/Bar'))

class Task extends Component {
  constructor(props) {
    super(props)
    this.tableRef = React.createRef()
  }

  state = {
    dataPie: [{ value: 0 }, { value: 0 }],
    dataLine: [
      {
        data: [],
      },
    ],
    dataBar: [{}],
    dataBar2: [{}],
    from: OPTIONS[4],
    fromValue: OPTIONS[4].value,
    sliderValue: [1, 2],
    loading: false,
    maxMinBar2Value: [5, 5],
    chartColor: addAlphaChannel(this.props.theme.secondaryColor, '0.95'),
    detailsClosed: true,
  }

  async componentDidMount() {
    const params = getParams(window.location.search)
    const res = await getDataFromDB(this.state.fromValue, params.task_id)
    const res2 = await getDataFromDB2(
      this.state.fromValue,
      params.task_id,
      this.state.sliderValue[0],
      this.state.sliderValue[1]
    )
    res.data[1][0].color = this.state.chartColor
    const bar1 = res.data[2].map((elem) => ({
      ...elem,
      attemptColor: this.state.chartColor,
    }))
    const bar2 = res2.data.map((elem) => ({
      ...elem,
      sukcesColor: this.state.chartColor,
    }))
    const maxMinBar2Value = bar2.reduce(
      (acc, elem) => {
        if (elem.sukces > acc[0]) {
          acc[0] = elem.sukces
        }
        if (elem.porazka < acc[1]) {
          acc[1] = elem.porazka
        }
        return acc
      },
      [0, 0]
    )
    this.setState({
      dataLine: [
        {
          ...res.data[0],
          color: this.state.chartColor,
        },
      ],
      dataPie: res.data[1],
      dataBar: bar1,
      dataBar2: bar2,
      maxMinBar2Value,
    })
  }

  onSelectChange = async (e) => {
    const params = getParams(window.location.search)
    const res = await getDataFromDB(e.value, params.task_id)
    const res2 = await getDataFromDB2(
      e.value,
      params.task_id,
      this.state.sliderValue[0],
      this.state.sliderValue[1]
    )
    res.data[1][0].color = this.state.chartColor
    const bar1 = res.data[2].map((elem) => ({
      ...elem,
      attemptColor: this.state.chartColor,
    }))
    const bar2 = res2.data.map((elem) => ({
      ...elem,
      sukcesColor: this.state.chartColor,
    }))
    const maxMinBar2Value = bar2.reduce(
      (acc, elem) => {
        if (elem.sukces > acc[0]) {
          acc[0] = elem.sukces
        }
        if (elem.porazka < acc[1]) {
          acc[1] = elem.porazka
        }
        return acc
      },
      [0, 0]
    )
    this.setState({
      dataLine: [
        {
          ...res.data[0],
          color: this.state.chartColor,
        },
      ],
      dataPie: res.data[1],
      dataBar: bar1,
      dataBar2: bar2,
      from: { label: e.label, value: e.value },
      fromValue: e.value,
      loading: false,
      maxMinBar2Value,
    })
  }

  onSliderValueChange = (value) => {
    this.setState({ sliderValue: [...value] })
  }

  onSliderAfterChange = async (value) => {
    this.setState({ loading: true })
    const params = getParams(window.location.search)
    const res = await getDataFromDB2(
      this.state.fromValue,
      params.task_id,
      value[0],
      value[1]
    )

    const dataBar2 = res.data.map((elem) => ({
      ...elem,
      sukcesColor: this.state.chartColor,
    }))

    const maxMinBar2Value = dataBar2.reduce(
      (acc, elem) => {
        if (elem.sukces > acc[0]) {
          acc[0] = elem.sukces
        }
        if (elem.porazka < acc[1]) {
          acc[1] = elem.porazka
        }
        return acc
      },
      [0, 0]
    )
    this.setState({ dataBar2, loading: false, maxMinBar2Value })
  }

  handleSwitchChange = (name) => (event) => {
    event.persist()
    if (event.target.checked) {
      this.setState({ [name]: !event.target.checked }, () => {
        window.scrollBy({
          top: this.props.isMobile ? 190 : 180,
          behavior: 'smooth',
        })
      })
    } else {
      setTimeout(() => {
        this.setState({ [name]: true })
      }, 600)
      const height = this.tableRef.current.offsetHeight
      window.scrollTo({
        left: 0,
        top: document.body.clientHeight - height - window.innerHeight,
        behavior: 'smooth',
      })
    }
  }

  render() {
    const {
      dataPie,
      dataLine,
      dataBar,
      dataBar2,
      sliderValue,
      maxMinBar2Value,
    } = this.state

    return (
      <Wrapper>
        <TopBar>
          <h3>Statystyki zadania</h3>
          <Select
            options={OPTIONS}
            styles={colourStyles.call(this)}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: addAlphaChannel(
                  this.props.theme.primaryColor,
                  '0.2'
                ),
                primary50: addAlphaChannel(
                  this.props.theme.primaryColor,
                  '0.5'
                ),
                primary: this.props.theme.primaryColor,
                neutral20: this.props.theme.inputBorderColor,
                neutral30: this.props.theme.inputBorderColorHover,
              },
            })}
            onChange={this.onSelectChange}
            value={this.state.from}
          />
        </TopBar>
        <Suspense
          fallback={
            <div
              style={{
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: '700',
                marginTop: '40px',
              }}
            >
              Wykresy się ładują...
            </div>
          }
        >
          <ChartWrapper>
            <h3>Statystyki poszczególnych podejść</h3>
            <ResponsiveBar
              data={dataBar}
              keys={['value']}
              indexBy='attempt'
              labelFormat={(v) => `${v}%`}
              margin={{
                top: 50,
                right: 70,
                bottom: 60,
                left: 70,
              }}
              padding={0.3}
              colorBy={({ data }) => data.attemptColor}
              borderColor='inherit:darker(1.6)'
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'podejście',
                legendPosition: 'middle',
                legendOffset: 45,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 15,
                tickRotation: 0,
                legend: 'procent sukcesów',
                legendPosition: 'middle',
                legendOffset: -60,
                format: (v) => `${v}%`,
              }}
              tooltip={(data) => (
                <div>
                  <p>
                    <strong style={{ color: data.color }}>
                      {data.data.value}%
                    </strong>{' '}
                    dobrych rozwiązań z <strong>{data.data.counter}</strong>
                  </p>
                </div>
              )}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor='inherit:darker(1.6)'
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              theme={theme(14)}
            />
          </ChartWrapper>
          <ChartWrapper
            mobileHeight={290}
            mobileWidth={320}
            marginBottom={'10px'}
            isMobile={this.props.isMobile}
          >
            <h3>Liczba poprawnych i błędnych rozwiązań zadania</h3>
            <p style={{ marginTop: '10px' }}>
              Wszystkich podejść{' '}
              <strong>{dataPie[0].value + dataPie[1].value}</strong>
            </p>
            <ResponsivePie
              data={dataPie}
              margin={{
                top: -40,
                right: 80,
                bottom: 0,
                left: 80,
              }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors='paired'
              colorBy={(e) => e.color}
              borderWidth={1}
              borderColor='inherit:darker(0)'
              radialLabelsSkipAngle={10}
              radialLabelsTextXOffset={6}
              radialLabelsTextColor='#333333'
              radialLabelsLinkOffset={0}
              radialLabelsLinkDiagonalLength={16}
              radialLabelsLinkHorizontalLength={16}
              radialLabelsLinkStrokeWidth={1}
              radialLabelsLinkColor='#000000'
              slicesLabelsSkipAngle={10}
              slicesLabelsTextColor='#333333'
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              tooltip={(data) => (
                <div>
                  <p>
                    <strong style={{ color: data.color }}>{data.value}</strong>{' '}
                    czyli{' '}
                    <strong>
                      {Math.round((data.value / data.all) * 100)}%
                    </strong>
                  </p>
                </div>
              )}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  translateY: 56,
                  translateX: 30,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000',
                      },
                    },
                  ],
                },
              ]}
            />
          </ChartWrapper>
          <ChartWrapper width={900}>
            <h3>Liczba testów w wybranym okresie</h3>
            <ResponsiveLine
              data={dataLine}
              margin={{
                top: 50,
                right: 60,
                bottom: 40,
                left: 60,
              }}
              xScale={{
                type: 'point',
              }}
              yScale={{
                type: 'linear',
                stacked: true,
                min: 0,
                max: dataLine[0].max < 10 ? 10 : dataLine[0].max,
              }}
              curve='linear'
              axisTop={null}
              axisRight={null}
              axisBottom={null}
              axisLeft={{
                orient: 'left',
                tickSize: 0,
                tickPadding: 20,
                tickRotation: 0,
                legend: 'liczba testów',
                legendOffset: -54,
                legendPosition: 'middle',
                itemSize: 20,
              }}
              enableGridX={false}
              colorBy={function (e) {
                return e.color
              }}
              enableDots={false}
              dotSize={10}
              dotColor='inherit:darker(0.3)'
              dotBorderWidth={2}
              dotBorderColor='#ffffff'
              dotLabel='y'
              dotLabelYOffset={-12}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              isInteractive={false}
              enableStackTooltip={false}
              legends={[]}
              theme={theme(18)}
            />
          </ChartWrapper>
          <ChartWrapper
            height={'auto'}
            marginBottom={'0px'}
            mobileHeight={'auto'}
            isMobile={this.props.isMobile}
          >
            <h3>Statystyki testów</h3>
            <Slider
              sliderValue={sliderValue}
              onSliderValueChange={this.onSliderValueChange}
              onSliderAfterChange={this.onSliderAfterChange}
              isLoading={this.state.loading}
            />
            <p style={{ textAlign: 'left' }}>Wybierz liczbę prób rozwiązania</p>
          </ChartWrapper>
          <ChartWrapper
            height={420}
            mobileHeight={425}
            isMobile={this.props.isMobile}
            marginBottom={'10px'}
          >
            <ResponsiveBar
              data={dataBar2}
              keys={['porazka', 'sukces']}
              indexBy='ID'
              height={420}
              colorBy={function (e) {
                const t = e.id
                return e.data[''.concat(t, 'Color')]
              }}
              minValue={-maxMinBar2Value[1] < 5 ? -5 : maxMinBar2Value[1]}
              maxValue={maxMinBar2Value[0] < 5 ? 5 : maxMinBar2Value[0]}
              margin={{
                top: 50,
                right: 70,
                bottom: 20,
                left: 70,
              }}
              labelFormat={(v) => (v < 0 ? -v : v)}
              padding={0.3}
              borderColor='inherit:darker(1.6)'
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'ID testu',
                legendPosition: 'middle',
                legendOffset: 45,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 15,
                tickRotation: 0,
                legend: 'ilosc sukcesów i porażek ',
                legendPosition: 'middle',
                legendOffset: -60,
                format: (v) => (v < 0 ? -v : v),
              }}
              /* tooltipFormat={v => (v < 0 ? -v : v)} */
              tooltip={(data) => (
                <div>
                  <p>
                    ID testu: <strong>{data.data.ID}</strong>
                  </p>
                  <p style={{ color: data.color }}>
                    Wartość:{' '}
                    <strong>{data.value < 0 ? -data.value : data.value}</strong>
                  </p>
                </div>
              )}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor='inherit:darker(1.6)'
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              theme={theme(14)}
            />
          </ChartWrapper>
          <SwitchWrapper marginBottom={this.state.detailsClosed}>
            <Switch
              style={{ marginTop: '100px' }}
              onChange={this.handleSwitchChange('detailsClosed')}
              value={!this.state.detailsClosed}
            />
            <span>
              Kliknij, aby wyświetlić <strong>szczegóły</strong> dla
              poszczególnych testów
            </span>
          </SwitchWrapper>
          {!this.state.detailsClosed && (
            <TableStyles ref={this.tableRef}>
              <ul className='responsive-table'>
                <li className='table-header'>
                  <div className='col col-1'>ID Testu</div>
                  <div className='col col-2'>Nazwa Funkcji</div>
                  <div className='col col-3'>Parametry</div>
                </li>

                {dataBar2.map((elem) => (
                  <li className='table-row' key={elem.ID} ref={this.tableRef}>
                    <div className='col col-1' data-label='ID Testu'>
                      <span>{elem.ID}</span>
                    </div>
                    <div className='col col-2' data-label='Nazwa Funkcji'>
                      <span>{elem.nazwaFunkcji}</span>
                    </div>
                    <div className='col col-3' data-label='Parametry'>
                      <span>{elem.parametry}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </TableStyles>
          )}
        </Suspense>
      </Wrapper>
    )
  }
}

export default compose(withTheme, withMatchMedia)(Task)
